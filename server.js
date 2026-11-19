import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import pg from "pg";
import nodemailer from "nodemailer";
import crypto from "node:crypto";
const {Pool}=pg,app=express();
app.set("trust proxy",1);app.use(helmet());app.use(express.json({limit:"25kb"}));
const origins=(process.env.ALLOWED_ORIGINS||"").split(",").map(x=>x.trim()).filter(Boolean);
app.use(cors({origin(o,cb){if(!o||!origins.length||origins.includes(o))return cb(null,true);cb(new Error("Nguồn truy cập không được phép."));}}));
app.use("/api/orders",rateLimit({windowMs:900000,limit:8,standardHeaders:"draft-7",legacyHeaders:false}));
const db=new Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.DATABASE_SSL==="true"?{rejectUnauthorized:false}:undefined});
const catalog=[["Bút bi TL-027",5000],["Bút bi G-118",8000],["Bút chì",5000],["Bút xóa kéo",15000],["Bút xóa nước",25000],["Giấy A4",410],["Giấy note (xấp)",8000],["Giấy note (11 tờ)",1000],["Giấy đôi",1000],["Vở 96 trang",5000],["Thước kẻ",5000],["Cục tẩy",5000],["Phách",5000],["Bánh tráng",2500],["Tắc",200],["Hạt hướng dương (9,25 g)",1000],["Đất sét tự khô",1350]];
const money=n=>new Intl.NumberFormat("vi-VN").format(n)+"đ";
const mailer=process.env.SMTP_HOST?nodemailer.createTransport({host:process.env.SMTP_HOST,port:+(process.env.SMTP_PORT||587),secure:process.env.SMTP_SECURE==="true",auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}}):null;
app.get("/api/health",(_q,s)=>s.json({ok:true}));
app.post("/api/orders",async(req,res)=>{
const {customerName,phone,fulfillment,address="",note="",items}=req.body||{};
if(typeof customerName!=="string"||customerName.trim().length<2||customerName.length>100)return res.status(400).json({message:"Vui lòng nhập họ tên hợp lệ."});
if(typeof phone!=="string"||!/^[0-9+ .()\\-]{9,20}$/.test(phone.trim()))return res.status(400).json({message:"Số điện thoại chưa hợp lệ."});
if(!["Nhận tại cửa hàng","Giao tận nơi"].includes(fulfillment))return res.status(400).json({message:"Hình thức nhận hàng không hợp lệ."});
if(fulfillment==="Giao tận nơi"&&(typeof address!=="string"||address.trim().length<8||address.length>250))return res.status(400).json({message:"Vui lòng nhập địa chỉ giao hàng."});
if(typeof note!=="string"||note.length>500||!Array.isArray(items)||!items.length||items.length>30)return res.status(400).json({message:"Thông tin đơn hàng không hợp lệ."});
const qs=new Map();for(const x of items){if(!Number.isInteger(x.productId)||!catalog[x.productId]||!Number.isInteger(x.quantity)||x.quantity<1||x.quantity>99)return res.status(400).json({message:"Sản phẩm hoặc số lượng không hợp lệ."});qs.set(x.productId,(qs.get(x.productId)||0)+x.quantity);}
const lines=[...qs].map(([id,quantity])=>({name:catalog[id][0],price:catalog[id][1],quantity}));
if(lines.some(x=>x.name==="Vở 96 trang")&&!lines.some(x=>x.name!=="Vở 96 trang"&&x.price>=5000))return res.status(400).json({message:"Vở 96 trang cần mua kèm ít nhất một món khác có giá từ 5.000đ trở lên."});
const total=lines.reduce((s,x)=>s+x.price*x.quantity,0),code="MHD-"+crypto.randomBytes(4).toString("hex").toUpperCase(),c=await db.connect();
try{await c.query("BEGIN");await c.query("INSERT INTO orders(order_code,customer_name,phone,fulfillment,address,note,items,total_vnd,status) VALUES($1,$2,$3,$4,$5,$6,$7,$8,'cho_xac_nhan')",[code,customerName.trim(),phone.trim(),fulfillment,fulfillment==="Giao tận nơi"?address.trim():"",note.trim(),JSON.stringify(lines),total]);await c.query("COMMIT")}
catch(e){await c.query("ROLLBACK");console.error(e);return res.status(500).json({message:"Chưa lưu được đơn hàng. Vui lòng thử lại."})}finally{c.release()}
let emailSent=false;
if(mailer&&process.env.ORDER_EMAIL_TO&&process.env.SMTP_FROM){try{await mailer.sendMail({from:process.env.SMTP_FROM,to:process.env.ORDER_EMAIL_TO,subject:"Đơn hàng mới "+code+" - Mây Học Đường",text:["Mã đơn: "+code,"Khách hàng: "+customerName.trim(),"Điện thoại: "+phone.trim(),"Hình thức nhận: "+fulfillment,fulfillment==="Giao tận nơi"?"Địa chỉ: "+address.trim():"","",...lines.map(x=>x.name+" × "+x.quantity+" | "+money(x.price*x.quantity)),"","Tổng cộng: "+money(total),"Ghi chú: "+(note.trim()||"Không có"),"Trạng thái: Chờ xác nhận"].join("\\n")});emailSent=true}catch(e){console.error("Đơn đã lưu nhưng email lỗi",code,e)}}
res.status(201).json({ok:true,orderCode:code,saved:true,emailSent});
});
app.listen(+(process.env.PORT||3000),()=>console.log("Mây Học Đường API đã chạy"));
