export const verificationTemplate = (activationToken) => {
  return `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.5;
      margin: 0;
      padding: 0;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9f9f9;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .button {
      display: block;
      padding: 10px 20px;
      width:30%;
      margin: 20px auto;
      background-color: #007bff;
      color: #ffffff;
      text-decoration: none;
      font-weight: bold;
      border-radius: 4px;
      text-align: center;
    }
    .footer {
      margin-top: 20px;
      text-align: center;
      font-size: 14px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1 class="header">Verification Email</h1>
    <p>Verify your account in the Saraha application by clicking the button below:</p>
    <a 
      href="${process.env.BASE_URL}/auth/activate/${activationToken}" 
      class="button"
    >
      Verify Account
    </a>
    <p class="footer">This link is valid for the next 12 hours only.</p>
  </div>
</body>
</html>`;
};
