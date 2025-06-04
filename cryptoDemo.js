import crypto from 'crypto';

//createHash()
// const hash = crypto.createHash('sha256')
// hash.update('password1234')
// console.log(hash.digest('hex'))

//randonBytes()
// crypto.randomBytes(16, (err, buff) => {
//     if (err) throw err;
//     console.log(buff.toString('hex'))
// })

//createCipheriv & createDicipheriv
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

//encrypted
const cipher = crypto.createCipheriv(algorithm, key, iv);
let encrypted = cipher.update('Hello, this is a secret message', 'utf8', 'hex')
encrypted += cipher.final('hex');
console.log(encrypted)

//decryted
const decipher = crypto.createDecipheriv(algorithm, key, iv);
let decrypted = decipher.update(encrypted, "hex", "utf8");
decrypted += decipher.final("utf8");
console.log(decrypted);