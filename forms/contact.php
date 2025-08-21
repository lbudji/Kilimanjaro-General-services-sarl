<?php
// Active l'affichage des erreurs pour le debug (à désactiver en production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Import des classes PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Chemins vers les classes PHPMailer
require '../assets/vendor/PHPMailer/src/Exception.php';
require '../assets/vendor/PHPMailer/src/PHPMailer.php';
require '../assets/vendor/PHPMailer/src/SMTP.php';

// Email destinataire
$receiving_email_address = 'info@kilimanjaroservices.com';

// Vérification du type de requête
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Récupération et nettoyage des données du formulaire
    $name    = trim($_POST['name'] ?? '');
    $email   = trim($_POST['email'] ?? '');
    $subject = trim($_POST['subject'] ?? 'No Subject');
    $message = trim($_POST['message'] ?? '');

    // Validation des champs requis
    if (empty($name) || empty($email) || empty($message)) {
        echo 'Please fill in all required fields.';
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo 'Invalid email format.';
        exit;
    }

    // Initialisation de PHPMailer
    $mail = new PHPMailer(true);

    try {
        // Configuration SMTP pour Zoho
        $mail->isSMTP();
        $mail->Host       = 'smtp.zoho.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'info@kilimanjaroservices.com';
        $mail->Password   = 'Bagaluza1995@'; // remplacez par le mot de passe d'application
        $mail->SMTPSecure = 'tls';
        $mail->Port       = 587;

        // Expéditeur et destinataire
        $mail->setFrom('info@kilimanjaroservices.com', $name);
        $mail->addAddress($receiving_email_address);
        $mail->addReplyTo($email, $name);

        // Contenu du mail
        $mail->isHTML(false);
        $mail->Subject = $subject;
        $mail->Body    =
            "You have received a new message from the website contact form:\n\n"
            . "Name: $name\n"
            . "Email: $email\n"
            . "Subject: $subject\n\n"
            . "Message:\n$message";

        // Envoi
        $mail->send();
        echo 'OK';
    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }

} else {
    echo 'Invalid request method.';
}
