<?php
// Demo mode - no database required
$message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $msg = $_POST['message'] ?? '';

    if ($name && $email && $msg) {
        // Demo: Save to file instead of database
        $data = date('Y-m-d H:i:s') . " | $name | $email | $msg\n";
        file_put_contents('contacts.txt', $data, FILE_APPEND);
        $message = 'Message sent successfully!';
    } else {
        $message = 'Please fill all fields';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>OTC Tag - Atoms World</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav>
        <div class="container">
            <h1>OTC Tag</h1>
            <div class="nav-links">
                <a href="#home">Home</a>
                <a href="#about">About</a>
                <a href="#contact">Contact</a>
            </div>
        </div>
    </nav>

    <section id="home" class="hero">
        <div class="container">
            <h2>OTC Tag System</h2>
            <p>Advanced tagging and tracking solutions for modern businesses.</p>
            <button onclick="scrollToSection('contact')">Get Started</button>
        </div>
    </section>

    <section id="about" class="about">
        <div class="container">
            <h2>About OTC Tag</h2>
            <p>Revolutionary tagging technology that transforms how you track and manage assets.</p>
            <div class="features">
                <div class="feature">
                    <h3>Real-time Tracking</h3>
                    <p>Monitor assets in real-time with precision accuracy.</p>
                </div>
                <div class="feature">
                    <h3>Secure & Reliable</h3>
                    <p>Enterprise-grade security for your critical data.</p>
                </div>
                <div class="feature">
                    <h3>Easy Integration</h3>
                    <p>Seamlessly integrate with existing systems.</p>
                </div>
            </div>
        </div>
    </section>

    <section id="contact" class="contact">
        <div class="container">
            <h2>Contact Us</h2>
            <?php if($message): ?>
                <p class="message"><?php echo $message; ?></p>
            <?php endif; ?>
            <form method="POST">
                <input type="text" name="name" placeholder="Name" required>
                <input type="email" name="email" placeholder="Email" required>
                <textarea name="message" placeholder="Message" required></textarea>
                <button type="submit">Send Message</button>
            </form>
        </div>
    </section>

    <footer>
        <div class="container">
            <p>&copy; 2026 OTC Tag - Atoms World</p>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>
