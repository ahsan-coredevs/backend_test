function generateOtpTamplate (otp,token) {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EduBlink's OTP</title>
    <style>
        .container {
           
            background-color: rgb(246, 245, 249);
            display: block;
            text-align: center;
            padding-top: 10vh;
            padding-bottom: 20px;
        }

        .template {
            width: 50%;
           
            background-color: rgb(255, 255, 255);
            padding: 5%;
            border-radius: 20px;
            margin: 0 auto;
        }

        h3 {
            text-align: center;
        }

        .headline {
            font-size: 40px;
            font-weight: bold;
        }

        .content {
            display: block;
            text-align: center;
        }

        .above-p {
            padding-bottom: 10px;
            color: rgb(43, 43, 43);
        }

        .buttom-p {
            padding-top: 10px;
            color: rgb(105, 105, 105);
        }

        .otp {
            height: 80px;
            width: 80%;
            border-radius: 20px;
            margin: 0 auto;
            font-size: 30px;
            font-weight: bold;
            background-color: rgb(239, 242, 241);
            line-height: 80px;
            text-align: center;
            margin-bottom: 20px;
        }

        @media (max-width: 768px) {
            .template {
                width: 80%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="template">
            <h1 class="headline">EduBlink</h1>
            <div class="content">
                <h3>Verify Your Email Address</h3>
                <p class="above-p">We have received an OTP attempt with the following code. Please enter it in the browser window where you started to verify for EduBlink.</p>
                <div class="otp"><p>${otp}</p></div>
                <a class="link" href="http://localhost:5173/verify_by_code/${otp}/${token}">Click To Verify Your Account.</a>
                <p class="buttom-p">If you did not attempt verification but received this email, please disregard it. The code will remain active for 5 minutes.</p>
            </div>
        </div>
    </div>
</body>
</html>
    `
}

module.exports = generateOtpTamplate;