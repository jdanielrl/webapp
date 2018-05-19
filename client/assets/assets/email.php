<?php

if(!$_POST) exit;

// Email verification, do not edit.
function isEmail($email_contact ) {
	return(preg_match("/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/",$email_contact ));
}

if (!defined("PHP_EOL")) define("PHP_EOL", "\r\n");
echo '<div class="error_message">Ejecuto el PHP!!!!</div>';

$email_contact    = $_POST['email_contact'];


if(trim($email_contact) == '') {
	echo '<div class="error_message">Por favor ingresa un email valido.</div>';
	exit();
}

//$address = "HERE your email address";
$address = "dramirez@pranasoluciones.com";


// Below the subject of the email
$e_subject = 'Felicidades por formar parte de esta comunidad...!!! ';

// You can change this if you feel that you need to.
$e_body = "Tu has sido contactado desde el la página principal de Cafesociety" . PHP_EOL . PHP_EOL;
$e_content = "\"\"" . PHP_EOL . PHP_EOL;
$e_reply = "Email enviado, $email_contact ";

$msg = wordwrap( $e_body . $e_content . $e_reply, 70 );

$headers = "From: $email_contact" . PHP_EOL;
$headers .= "Reply-To: $email_contact" . PHP_EOL;
$headers .= "MIME-Version: 1.0" . PHP_EOL;
$headers .= "Content-type: text/plain; charset=utf-8" . PHP_EOL;
$headers .= "Content-Transfer-Encoding: quoted-printable" . PHP_EOL;

$user = "$email_contact";
$usersubject = "Thank You";
$userheaders = "From: info@udema.com\n";
$usermessage = "Thank you for contact UDEMA. We will reply shortly!";
mail($user,$usersubject,$usermessage,$userheaders);

if(mail($address, $e_subject, $msg, $headers)) {

	// Success message
	echo "<div id='success_page' style='padding:25px 0'>";
	echo "<strong >Email Sent.</strong><br>";
	echo "Thank you <strong>$name_contact</strong>,<br> your message has been submitted. We will contact you shortly.";
	echo "</div>";

} else {

	echo 'ERROR!';

}
