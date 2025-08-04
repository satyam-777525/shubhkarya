import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div style={{ padding: '80px 20px', maxWidth: '900px', margin: '0 auto', lineHeight: '1.7', color: '#2d1a05' }}>
      <h1 style={{ fontSize: '2.5rem', color: '#cc6600', marginBottom: '30px', textAlign: 'center' }}>Privacy Policy for Shubhkarya</h1>

      <p style={{ marginBottom: '20px' }}>
        <strong>Last Updated: July 26, {new Date().getFullYear()}</strong>
      </p>

      <p style={{ marginBottom: '20px' }}>
        Welcome to Shubhkarya! This Privacy Policy describes how Shubhkarya ("we," "us," or "our") collects, uses, and shares your personal information when you use our website and services (collectively, the "Services"). By accessing or using our Services, you agree to the terms of this Privacy Policy.
      </p>

      <h2 style={{ fontSize: '1.8rem', color: '#a86200', marginTop: '40px', marginBottom: '15px' }}>1. Information We Collect</h2>
      <p style={{ marginBottom: '15px' }}>We collect various types of information in connection with the Services, including:</p>
      <ul style={{ listStyleType: 'disc', marginLeft: '25px', marginBottom: '20px' }}>
        <li style={{ marginBottom: '10px' }}>
          <strong>Personal Information:</strong> This includes information you provide directly to us, such as your name, email address, phone number, physical address, payment information (e.g., credit card details, bank account info), and any other information you choose to provide when creating an account, booking a puja, or contacting customer support.
        </li>
        <li style={{ marginBottom: '10px' }}>
          <strong>Demographic Information:</strong> Such as date of birth, gender, and language preferences.
        </li>
        <li style={{ marginBottom: '10px' }}>
          <strong>Pooja/Service Details:</strong> Information about the specific pujas or services you book, including dates, times, and any special requests or notes you provide.
        </li>
        <li style={{ marginBottom: '10px' }}> {/* Removed extra '>' here if it was present previously, ensuring consistent format */}
          <strong>Location Information:</strong> We may collect precise location data if you enable location services on your device and grant us permission. This helps us connect you with nearby Pandits.
        </li>
        <li style={{ marginBottom: '10px' }}> {/* Removed extra '>' here if it was present previously */}
          <strong>Usage Information:</strong> Information about how you interact with our Services, including your IP address, browser type, operating system, pages viewed, time spent on pages, referral source, and clicks.
        </li>
        <li style={{ marginBottom: '10px' }}> {/* Removed extra '>' here if it was present previously */}
          <strong>Communication Data:</strong> Records of your communications with us and with Pandits through our platform.
        </li>
        <li style={{ marginBottom: '10px' }}> {/* Confirmed this line is correct, without extra '>' */}
          <strong>With Service Providers:</strong> We may share your information with third-party vendors, consultants, and other service providers who perform services on our behalf (e.g., payment processing, hosting, analytics, customer support).
        </li>
        <li style={{ marginBottom: '10px' }}>
          <strong>For Legal Reasons:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court order or government agency).
        </li>
        <li style={{ marginBottom: '10px' }}> {/* Removed extra '>' here if it was present previously */}
          <strong>Business Transfers:</strong> In connection with any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company.
        </li>
        <li style={{ marginBottom: '10px' }}> {/* Removed extra '>' here if it was present previously */}
          <strong>Aggregated or Anonymized Data:</strong> We may share aggregated or de-identified information that cannot reasonably be used to identify you.
        </li>
      </ul>

      <h2 style={{ fontSize: '1.8rem', color: '#a86200', marginTop: '40px', marginBottom: '15px' }}>2. How We Use Your Information</h2>
      <p style={{ marginBottom: '15px' }}>We use the information we collect for various purposes, including:</p>
      <ul style={{ listStyleType: 'disc', marginLeft: '25px', marginBottom: '20px' }}>
        <li style={{ marginBottom: '10px' }}>To provide and manage the Services, including processing your puja bookings and connecting you with Pandits.</li>
        <li style={{ marginBottom: '10px' }}>To process payments and complete transactions.</li>
        <li style={{ marginBottom: '10px' }}>To communicate with you about your bookings, account, and Service updates.</li>
        <li style={{ marginBottom: '10px' }}>To personalize your experience and offer relevant services.</li>
        <li style={{ marginBottom: '10px' }}>To improve and optimize our Services, including developing new features.</li>
        <li style={{ marginBottom: '10px' }}>To monitor and analyze trends, usage, and activities in connection with our Services.</li>
        <li style={{ marginBottom: '10px' }}>To detect, investigate, and prevent fraudulent transactions and other illegal activities.</li>
        <li style={{ marginBottom: '10px' }}> {/* **FIXED THIS LINE (Line 61)**: Ensure it ends with '}}>' */}
          To comply with legal obligations and enforce our terms and policies.
        </li>
      </ul>

      <h2 style={{ fontSize: '1.8rem', color: '#a86200', marginTop: '40px', marginBottom: '15px' }}>3. How We Share Your Information</h2>
      <p style={{ marginBottom: '15px' }}>We may share your information in the following circumstances:</p>
      <ul style={{ listStyleType: 'disc', marginLeft: '25px', marginBottom: '20px' }}>
        <li style={{ marginBottom: '10px' }}>
          <strong>With Pandits:</strong> We share necessary booking details (your name, contact information, address, puja details) with the Pandits you book services from to facilitate the puja.
        </li>
        <li style={{ marginBottom: '10px' }}>
          <strong>With Service Providers:</strong> We may share your information with third-party vendors, consultants, and other service providers who perform services on our behalf (e.g., payment processing, hosting, analytics, customer support).
        </li>
        <li style={{ marginBottom: '10px' }}>
          <strong>For Legal Reasons:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court order or government agency).
        </li>
        <li style={{ marginBottom: '10px' }}>
          <strong>Business Transfers:</strong> In connection with any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company.
        </li>
        <li style={{ marginBottom: '10px' }}>
          <strong>Aggregated or Anonymized Data:</strong> We may share aggregated or de-identified information that cannot reasonably be used to identify you.
        </li>
      </ul>

      <h2 style={{ fontSize: '1.8rem', color: '#a86200', marginTop: '40px', marginBottom: '15px' }}>4. Data Security</h2>
      <p style={{ marginBottom: '20px' }}>
        We take reasonable measures to protect your personal information from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. However, no data transmission over the Internet or method of electronic storage is 100% secure.
      </p>

      <h2 style={{ fontSize: '1.8rem', color: '#a86200', marginTop: '40px', marginBottom: '15px' }}>5. Your Choices and Rights</h2>
      <p style={{ marginBottom: '15px' }}>You have certain choices and rights regarding your personal information:</p>
      <ul style={{ listStyleType: 'disc', marginLeft: '25px', marginBottom: '20px' }}>
        <li style={{ marginBottom: '10px' }}>You may update or correct your account information at any time by logging into your account settings.</li>
        <li style={{ marginBottom: '10px' }}>You can opt-out of receiving promotional emails from us by following the instructions in those emails.</li>
        <li style={{ marginBottom: '10px' }}>You can disable location services on your device if you do not wish for us to collect precise location information.</li>
      </ul>

      <h2 style={{ fontSize: '1.8rem', color: '#a86200', marginTop: '40px', marginBottom: '15px' }}>6. Cookies and Tracking Technologies</h2>
      <p style={{ marginBottom: '20px' }}>
        We and our service providers use cookies and similar tracking technologies to collect information about your Browse activities and to remember your preferences. You can typically set your browser to remove or reject browser cookies.
      </p>

      <h2 style={{ fontSize: '1.8rem', color: '#a86200', marginTop: '40px', marginBottom: '15px' }}>7. Changes to This Privacy Policy</h2>
      <p style={{ marginBottom: '20px' }}> {/* **FIXED THIS LINE (Line 93 from error output)**: Ensure it ends with '}}>' */}
        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review this Privacy Policy periodically for any changes.
      </p>

      <h2 style={{ fontSize: '1.8rem', color: '#a86200', marginTop: '40px', marginBottom: '15px' }}>8. Contact Us</h2>
      <p style={{ marginBottom: '20px' }}>
        If you have any questions about this Privacy Policy, please contact us at:
      </p>
      <p style={{ marginBottom: '10px' }}>Email: info@shubhkarya.com</p>
      <p style={{ marginBottom: '10px' }}>Mobile: +91 98765 43210</p>
      <p style={{ marginBottom: '20px' }}>Address: 123 Divine Path, Spiritual Nagar, Hathras, Uttar Pradesh, India - 204101</p>
    </div>
  );
};

export default PrivacyPolicy;