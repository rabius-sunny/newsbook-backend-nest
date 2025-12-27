export const defaultPageContent = [
  {
    id: '1',
    title: 'About Us',
    slug: 'about-us',
    content: `
      <h2>Welcome to Our News Platform</h2>
      <p>We are a dedicated Bengali news platform committed to bringing you the latest and most accurate news from around the world. Our team of experienced journalists works around the clock to ensure you stay informed about what matters most.</p>
      
      <h3>Our Mission</h3>
      <p>To provide reliable, unbiased, and timely news coverage that empowers our readers to make informed decisions about their world.</p>
      
      <h3>Our Values</h3>
      <ul>
        <li>Accuracy and truthfulness in reporting</li>
        <li>Independence and editorial integrity</li>
        <li>Respect for diverse perspectives</li>
        <li>Community engagement and service</li>
      </ul>
    `,
    metaTitle: 'About Us - Your Trusted News Source',
    metaDescription:
      'Learn more about our mission, values, and commitment to delivering accurate news coverage.',
    isActive: true,
    showInFooter: true,
    showInHeader: false,
    displayOrder: 1,
  },
  {
    id: '2',
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    content: `
      <h2>Privacy Policy</h2>
      <p><em>Last updated: ${new Date().toLocaleDateString()}</em></p>
      
      <h3>Information We Collect</h3>
      <p>We collect information you provide directly to us, such as when you subscribe to our newsletter, create an account, or contact us.</p>
      
      <h3>How We Use Your Information</h3>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide and improve our services</li>
        <li>Send you newsletters and updates</li>
        <li>Respond to your inquiries</li>
        <li>Ensure the security of our platform</li>
      </ul>
      
      <h3>Data Protection</h3>
      <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
      
      <h3>Contact Us</h3>
      <p>If you have any questions about this Privacy Policy, please contact us at privacy@example.com</p>
    `,
    metaTitle: 'Privacy Policy - How We Protect Your Data',
    metaDescription:
      'Learn about our privacy practices and how we protect your personal information.',
    isActive: true,
    showInFooter: true,
    showInHeader: false,
    displayOrder: 2,
  },
  {
    id: '3',
    title: 'Terms & Conditions',
    slug: 'terms-conditions',
    content: `
      <h2>Terms & Conditions</h2>
      <p><em>Last updated: ${new Date().toLocaleDateString()}</em></p>
      
      <h3>Acceptance of Terms</h3>
      <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
      
      <h3>Content Usage</h3>
      <p>The content on this website is for informational purposes only. You may not republish, reproduce, or distribute our content without permission.</p>
      
      <h3>User Conduct</h3>
      <p>Users are expected to:</p>
      <ul>
        <li>Respect other users and contributors</li>
        <li>Not post inappropriate or offensive content</li>
        <li>Comply with all applicable laws and regulations</li>
      </ul>
      
      <h3>Limitation of Liability</h3>
      <p>We are not liable for any damages that may occur from the use of this website or its content.</p>
      
      <h3>Changes to Terms</h3>
      <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting.</p>
    `,
    metaTitle: 'Terms & Conditions - Website Usage Guidelines',
    metaDescription: 'Read our terms and conditions for using our news platform and services.',
    isActive: true,
    showInFooter: true,
    showInHeader: false,
    displayOrder: 3,
  },
]
