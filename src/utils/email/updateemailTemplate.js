export const verifyUpdateEmail = (verification_link) => {
  return `
    
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email Address</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      padding: 20px;
    }
    .email-header {
      text-align: center;
      padding: 10px 0;
      background-color: #007bff;
      color: #ffffff;
    }
    .email-header h1 {
      margin: 0;
      font-size: 24px;
    }
    .email-body {
      padding: 20px;
      font-size: 16px;
      line-height: 1.6;
      text-align: left;
    }
    .email-body p {
      margin: 0 0 10px;
    }
    .email-footer {
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #888;
    }
    .verify-button {
      display: block;
      padding: 10px 20px;
      width:30%;
      margin: 20px auto;
      color: #ffffff;
      background-color: #007bff;
      text-decoration: none;
      border-radius: 4px;
      font-size: 16px;
      text-align:center;
    }
    .verify-button:hover {
      background-color: #0056b3;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>Verify Your New Email Address</h1>
    </div>
    <div class="email-body">
      <p>Hi,</p>
      <p>We received a request to update your email address for your account. To confirm this change, please click the button below:</p>
      <a href="${verification_link}" class="verify-button">Verify Email</a>
      <p>If you did not request this change, you can safely ignore this email. The link will expire in 1 minute.</p>
      <p>Thank you for using our service!</p>
    </div>
    <div class="email-footer">
      <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
};
