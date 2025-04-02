<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set JSON header
header('Content-Type: application/json');

// Verify request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit();
}

// Sanitize inputs
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// Collect and validate form data
$name = sanitize_input($_POST['name'] ?? '');
$email = sanitize_input($_POST['email'] ?? '');
$message = sanitize_input($_POST['message'] ?? '');

// Validate required fields
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'All fields are required']);
    exit();
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid email format']);
    exit();
}

// Email configuration
$to_email = "chisomsomtochi@gmail.com";  // Recipient (your domain email)
$subject = "New Contact Form Submission: $name";
$from_email = "chisomsomtochi@gmail.com";  // Sender (MUST match your domain)

// Email template
$email_message = "
<!DOCTYPE html>
<html>
<head>
    <title>New Contact Form Submission</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4b2e83; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .detail { margin-bottom: 15px; }
        .label { font-weight: bold; color: #2f1c6a; }
        .footer { margin-top: 20px; font-size: 12px; text-align: center; color: #777; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>New Contact Form Submission</h2>
        </div>
        <div class='content'>
            <div class='detail'>
                <span class='label'>Name:</span> $name
            </div>
            <div class='detail'>
                <span class='label'>Email:</span> $email
            </div>
            <div class='detail'>
                <span class='label'>Email:</span> $subject
            </div>
            <div class='detail'>
                <span class='label'>Message:</span><br>
                ".nl2br($message)."
            </div>
        </div>
        <div class='footer'>
            This message was sent from the contact form on ".date('F j, Y \a\t g:i a')."
        </div>
    </div>
</body>
</html>
";

// Email headers
$headers = [
    'From' => $from_email,
    'Reply-To' => $email,  // Allows direct reply to the visitor
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/html; charset=UTF-8',
    'X-Mailer' => 'PHP/' . phpversion()
];

// Build headers string
$headers_str = '';
foreach ($headers as $key => $value) {
    $headers_str .= "$key: $value\r\n";
}

// Send email
try {
    $mail_sent = mail($to_email, $subject, $email_message, $headers_str);

    if (!$mail_sent) {
        throw new Exception('Mail function failed');
    }

    // Log successful submission
    file_put_contents('contact_log.txt', date('Y-m-d H:i:s')." - Message from $name ($email)\n", FILE_APPEND);
    
    echo json_encode([
        'status' => 'success', 
        'message' => 'Your message has been sent successfully!'
    ]);
    
} catch (Exception $e) {
    // Log error
    error_log('Contact form error: ' . $e->getMessage());
    file_put_contents('mail_errors.log', date('Y-m-d H:i:s')." - Error: ".$e->getMessage()."\n", FILE_APPEND);
    
    http_response_code(500);
    echo json_encode([
        'status' => 'error', 
        'message' => 'Failed to send message. Please try again later.'
    ]);
}
?>