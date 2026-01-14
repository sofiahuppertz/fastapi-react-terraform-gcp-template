import os
import resend
from pathlib import Path

class EmailService:
    def __init__(self):
        resend_api_key = os.getenv("RESEND_API_KEY")
        if not resend_api_key:
            raise ValueError("RESEND_API_KEY environment variable not set")
        resend.api_key = resend_api_key

        # Sender email from environment variable
        self.sender_email = os.getenv("RESEND_SENDER_EMAIL", "Sofia <onboarding@resend.dev>")

        # Define template path relative to project root
        self.template_dir = Path(__file__).parent.parent / "static" / "templates" / "emails"

        # Ensure directory exists
        self.template_dir.mkdir(parents=True, exist_ok=True)

        # Load templates
        self.activation_template = self._load_template("activation.html")
        self.password_reset_template = self._load_template("password_reset.html")

    def _load_template(self, template_name: str) -> str:
        """Load an email template from the templates directory."""
        template_path = self.template_dir / template_name
        return template_path.read_text()

    def send_activation_email(self, email: str, activation_code: str):
        """Send activation email to user with their activation code."""
        try:
            # Format template with variables
            html_content = self.activation_template.replace("{{activation_code}}", activation_code)

            # Send email
            resend.Emails.send({
                "from": self.sender_email,
                "to": email,
                "subject": "Activate Your Account",
                "html": html_content,
            })
            return True
        except Exception as e:
            print(f"Error sending activation email: {str(e)}")
            return False

    def send_password_reset_email(self, email: str, reset_code: str):
        """Send password reset email to user with their reset code."""
        try:
            # Format template with variables
            html_content = self.password_reset_template.replace("{{reset_code}}", reset_code)

            # Send email
            resend.Emails.send({
                "from": self.sender_email,
                "to": email,
                "subject": "Reset Your Password",
                "html": html_content,
            })
            return True
        except Exception as e:
            print(f"Error sending password reset email: {str(e)}")
            return False
