import React from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import fs from 'fs';
import path from 'path';
import Iframe from 'react-iframe';
import jsPDF from 'jspdf';
import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faFacebook, faLinkedin } from '@fortawesome/free-brands-svg-icons';

interface Data {
  date: string;
  range: string[];
  name: string;
  programText: string;
}

interface Props {
  data: Data;
}

const Page = ({ data }: Props) => {
  const router = useRouter();
  const { id } = router.query;

  const generatePDF = () => {
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.setFillColor('#161616');
    pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');

    const logo3 = '/logo3.png';
    const logo4 = '/logo4.png';
    const logo2 = '/logo2.png';

    const logo3Width = 35;
    const logo3Height = 30;
    const logo3X = 10;
    const logo3Y = 0;
    pdf.addImage(logo3, 'PNG', logo3X, logo3Y, logo3Width, logo3Height);

    const logo4Width = 190;
    const logo4Height = 40;
    const logo4X = (pdfWidth - logo4Width) / 2;
    const logo4Y = logo3Y + logo3Height + 10;
    pdf.addImage(logo4, 'PNG', logo4X, logo4Y, logo4Width, logo4Height);

    pdf.setTextColor('#FFFFFF');
    pdf.setFontSize(28);
    pdf.text('ukończenia programu stażowego', pdfWidth / 2, logo4Y + logo4Height + 10, { align: 'center' });

    pdf.setFontSize(16);
    pdf.text('POŚWIADCZA, ŻE', pdfWidth / 2, logo4Y + logo4Height + 35, { align: 'center' });

    pdf.setFontSize(38);
    pdf.text(data.name.toUpperCase(), pdfWidth / 2, logo4Y + logo4Height + 50, { align: 'center' });

    pdf.setFontSize(17);
    pdf.setTextColor('#a8a8a8');
    pdf.text(data.programText, pdfWidth / 2, logo4Y + logo4Height + 60, { align: 'center' });

    pdf.setFontSize(18);
    pdf.setTextColor('#FFFFFF');
    pdf.setFont('times', 'italic');
    const signatureY = pdfHeight - 25;
    pdf.text('Kajetan Zimniak', pdfWidth / 2, signatureY, { align: 'center' });

    pdf.setTextColor('#a8a8a8');
    const ceoY = signatureY + 10;
    pdf.text('CEO', pdfWidth / 2, ceoY, { align: 'center' });

    const logoWidth = 50;
    const logoHeight = 10;
    const logoX = 20;
    const logoY = pdfHeight - 30;
    pdf.addImage(logo2, 'PNG', logoX, logoY, logoWidth, logoHeight);

    pdf.setFontSize(21);
    pdf.setTextColor('#FFFFFF');
    pdf.text(data.date, pdfWidth - 40, pdfHeight - 20);

    pdf.save(`${id}.pdf`);
  };

  const iframeUrl = `/html_css.html?date=${encodeURIComponent(data.date)}&name=${encodeURIComponent(data.name)}&programText=${encodeURIComponent(data.programText)}`;

  return (
    <>
      <Head>
        <title>Sysmo.pl - rozwiązania IT | Internship program</title>
      </Head>
      <div className="container">
        <div className="main-content">
          <Iframe
            url={iframeUrl}
            width="85%"
            height="900px"
            id="myId"
            display="initial"
            position="relative"
            allowFullScreen
          />
        </div>
        <div className="sidebar">
          <h1>Zdobyte umiejętności</h1>
          <ul style={{ marginTop: '30px', padding: '0', listStyle: 'none', width: 'fit-content', textAlign: 'center', marginBottom: '30px' }}>
            {data.range.map((skill, index) => (
              <li key={index} style={{ padding: '5px 40px', fontSize: '26px', borderRadius: '50px', border: '2px solid black', backgroundColor: 'transparent', cursor: 'pointer', margin: '0 auto 20px' }}>
                {skill}
              </li>
            ))}
          </ul>
          <h1>Wystawiono dnia:</h1>
          <p style={{ color: '#454545', fontSize: '23px', fontWeight: 'bold', width: '100%' }}>{data.date}</p>
          <button onClick={generatePDF} style={{ marginTop: '20px', padding: '12px 45px', fontSize: '26px', borderRadius: '50px', backgroundColor: 'black', color: 'white', border: 'none', cursor: 'pointer', display: 'block' }}>
            Pobierz certyfikat
          </button>
        </div>
      </div>
      <footer>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div>
            <img src="/logo2.png" alt="logo2" />
            <p>
              Sysmo.pl – rozwiązania IT sp.z o.o.<br /><br />
              NIP: 7822889486<br />
              REGON: 387542528<br />
              KRS: 0000870256
            </p>
          </div>
          <div className="contact">
            <h1>Kontakt</h1>
            <p>
              <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '10px' }} />
              contact@sysmo.pl
            </p>
            <p>
              <FontAwesomeIcon icon={faPhone} style={{ marginRight: '10px' }} />
              +48 123 456 789
            </p>
            <p>
              <FontAwesomeIcon icon={faGlobe} style={{ marginRight: '10px' }} />
              www.sysmo.pl
            </p>
          </div>
          <div className="follow-us">
            <h1>Obserwuj nas</h1>
            <div className="icons">
              <FontAwesomeIcon icon={faInstagram} className="icon" />
              <FontAwesomeIcon icon={faFacebook} className="icon" />
              <FontAwesomeIcon icon={faLinkedin} className="icon" />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  const filePath = path.join(process.cwd(), 'src', 'data', 'data.json');
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(jsonData)[id as string];

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      data,
    },
  };
};

export default Page;