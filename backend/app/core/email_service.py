import os
import resend
from datetime import datetime
from pathlib import Path

class EmailService:
    def __init__(self):
        resend_api_key = os.getenv("RESEND_API_KEY")
        if not resend_api_key:
            raise ValueError("RESEND_API_KEY environment variable not set")
        resend.api_key = resend_api_key
        
        # Define template and asset paths relative to project root
        self.template_dir = Path(__file__).parent.parent / "static" / "templates" / "emails"
        self.assets_dir = self.template_dir / "assets"
        
        # Ensure directories exist
        self.template_dir.mkdir(parents=True, exist_ok=True)
        self.assets_dir.mkdir(parents=True, exist_ok=True)
        
        # Load templates
        self.activation_template = self._load_template("activation.html")
        self.password_reset_template = self._load_template("password_reset.html")

    def _load_template(self, template_name: str) -> str:
        """Load an email template from the templates directory."""
        template_path = self.template_dir / template_name
        return template_path.read_text()

    def _load_image(self, image_name: str) -> bytes:
        """Load an image from the assets directory."""
        image_path = self.assets_dir / image_name
        if image_path.exists():
            return image_path.read_bytes()
        raise FileNotFoundError(f"Image not found: {image_name}")

    def send_activation_email(self, email: str, activation_code: str):
        """Send activation email to user with their activation code."""
        try:
            # Try to load images
            try:
                hero_image = self._load_image("hero_parfumsplus.png")
                logo_image = self._load_image("logo_parfumsplus.jpg")
            except FileNotFoundError as e:
                print(f"Warning: {str(e)} - sending email without images")
                hero_image = logo_image = None

            # Prepare attachments if images exist
            attachments = []
            if hero_image and logo_image:
                attachments = [
                    {
                        "filename": "hero_parfumsplus.jpg",
                        "content": list(hero_image),
                        "content_type": "image/jpeg",
                    },
                    {
                        "filename": "logo_parfumsplus.png",
                        "content": list(logo_image),
                        "content_type": "image/png",
                    }
                ]

            # Format template with variables
            html_content = self.activation_template.replace("{{code}}", activation_code).replace("{{year}}", str(datetime.now().year))

            # Send email
            email_params = {
                "from": "no-reply@parfumsplusai.com",
                "to": email,
                "subject": "Activation de votre compte ParfumsPlus",
                "html": html_content,
            }
            if attachments:
                email_params["attachments"] = attachments

            resend.Emails.send(email_params)
            return True
        except Exception as e:
            print(f"Error sending activation email: {str(e)}")
            return False

    def send_password_reset_email(self, email: str, reset_code: str):
        """Send password reset email to user with their reset code."""
        try:
            try:
                hero_image = self._load_image("hero_parfumsplus.png")
                logo_image = self._load_image("logo_parfumsplus.jpg")
            except FileNotFoundError as e:
                print(f"Warning: {str(e)} - sending email without images")
                hero_image = logo_image = None

            attachments = []
            if hero_image and logo_image:
                attachments = [
                    {
                        "filename": "hero_parfumsplus.jpg",
                        "content": list(hero_image),
                        "content_type": "image/jpeg",
                    },
                    {
                        "filename": "logo_parfumsplus.png",
                        "content": list(logo_image),
                        "content_type": "image/png",
                    }
                ]

            html_content = self.password_reset_template.replace("{{code}}", reset_code).replace("{{year}}", str(datetime.now().year))

            email_params = {
                "from": "no-reply@parfumsplusai.com",
                "to": email,
                "subject": "Reinitialisation de votre mot de passe ParfumsPlus",
                "html": html_content,
            }
            if attachments:
                email_params["attachments"] = attachments

            resend.Emails.send(email_params)
            return True
        except Exception as e:
            print(f"Error sending password reset email: {str(e)}")
            return False