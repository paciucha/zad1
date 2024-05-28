import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import fs from 'fs';
import path from 'path';
import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface Data {
  title: string;
  text: string;
  image: string;
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
    const input = document.getElementById('content')!;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.setFillColor('#161616');
      pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
  
      const borderWidth = 6;
      pdf.setDrawColor('#FFFFFF');
      pdf.setLineWidth(borderWidth);
      pdf.rect(0, 0, pdfWidth, pdfHeight);
      
      const logo3Width = 30;
      const logo3Height = 25;
      const logo3X = (pdfWidth - logo3Width) / 2;
      const logo3Y = borderWidth + 5;
      pdf.addImage('/logo3.png', 'PNG', logo3X, logo3Y, logo3Width, logo3Height);
  
      const logo4Width = 155;
      const logo4Height = 30;
      const logo4X = (pdfWidth - logo4Width) / 2;
      const logo4Y = logo3Height + 20;
      pdf.addImage('/logo4.png', 'PNG', logo4X, logo4Y, logo4Width, logo4Height);
  
      pdf.setFontSize(23);
      pdf.setTextColor('#FFFFFF');
      pdf.text('ukonczenia programu stazowego', pdfWidth / 2, logo4Y + logo4Height + 10, { align: 'center' });

      pdf.setFontSize(14);
      const poswiadczaY = logo4Y + logo4Height + 40;
      pdf.text('POSWIADCZA, ZE', pdfWidth / 2, poswiadczaY, { align: 'center' });

      const nameY = poswiadczaY + 15;
      pdf.setFontSize(38);
      pdf.text(data.name.toUpperCase(), pdfWidth / 2, nameY, { align: 'center' });

      const programTextY = nameY + 10;
      pdf.setFontSize(15);
      pdf.setTextColor('#a8a8a8');
      pdf.text(data.programText, pdfWidth / 2, programTextY, { align: 'center' });

      const logoWidth = 50;
      const logoHeight = 10;
      const logoX = 20;
      const logoY = pdf.internal.pageSize.getHeight() - 30;
      pdf.addImage('/logo2.png', 'PNG', logoX, logoY, logoWidth, logoHeight);

      pdf.setFontSize(18);

      pdf.setTextColor('#FFFFFF');
      pdf.setFont('times', 'italic');
      pdf.text('Kajetan Zimniak', pdfWidth / 2, logoY + 10, { align: 'center' });

      pdf.setTextColor('#a8a8a8');
      pdf.setFont('times', 'italic');
      pdf.text('CEO', pdfWidth / 2, logoY + 20, { align: 'center' });

      pdf.setFontSize(20);
      pdf.setFont('times', 'normal');
      pdf.text('01/06/2024', pdfWidth - 40, logoY + 10);

      pdf.save(`${id}.pdf`);
    });
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <img src="/logo.png" alt="logo" style={{ position: 'absolute', top: '20px', left: '20px', width: '100px', height: 'auto' }} />
      <div id="content" style={{ padding: '20px', textAlign: 'center' }}>
        <h1>{data.title}</h1>
        <p>{data.text}</p>
        <img src={data.image} alt={data.title} style={{ width: '100%', height: 'auto' }} />
        <button onClick={generatePDF} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}>
          Pobierz PDF
        </button>
      </div>

      <footer style={{ backgroundColor: '#111111', color: 'white', padding: '40px 10%', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div className="column">
          <img src="/logo2.png" alt="logo 2" />
          <p style={{ fontSize: '21px', color: '#e0e0e0', lineHeight: 1.35, fontWeight: 500 }}>
            Sysmo.pl – rozwiązania IT sp.z o.o.<br />
            NIP: 7822889486<br />
            REGON: 387542528<br />
            KRS: 0000870256
          </p>  
        </div>
        <div className="column">
          <h3>Mapa strony</h3>
          <p><a href="https://sysmo.pl/" style={{ color: '#b8bcbd', textDecoration: 'none', fontSize: '21px' }}>Home</a></p>
          <p><a href="https://sysmo.pl/uslugi/" style={{ color: '#b8bcbd', textDecoration: 'none', fontSize: '21px' }}>Usługi</a></p>
          <p><a href="https://sysmo.pl/realizacje/" style={{ color: '#b8bcbd', textDecoration: 'none', fontSize: '21px' }}>Realizacje</a></p>
          <p><a href="https://sysmo.pl/o-nas/" style={{ color: '#b8bcbd', textDecoration: 'none', fontSize: '21px' }}>O nas</a></p>
          <p><a href="https://sysmo.pl/artykuly/" style={{ color: '#b8bcbd', textDecoration: 'none', fontSize: '21px' }}>Artykuły</a></p>
          <p><a href="https://sysmo.pl/faq/" style={{ color: '#b8bcbd', textDecoration: 'none', fontSize: '21px' }}>FAQ</a></p>
          <p><a href="https://zleca.pl/wykonawca/sysmo-aplikacje-mobilne-i-webowe-1601013554-1601006354" style={{ color: '#b8bcbd', textDecoration: 'none', fontSize: '21px' }}>Zleca.pl</a></p>
          <p><a href="https://sysmo.pl/kariera/" style={{ color: '#b8bcbd', textDecoration: 'none', fontSize: '21px' }}>Kariera</a></p>
          <p><a href="https://sysmo.pl/kontakt/" style={{ color: '#b8bcbd', textDecoration: 'none', fontSize: '21px' }}>Kontakt</a></p>
        </div>
        <div className="column">
          <h3>Kontakt</h3>
          <p><a href="mailto:contact@sysmo.pl" style={{ color: '#b8bcbd', textDecoration: 'none', fontSize: '21px' }}>contact@sysmo.pl</a></p>
          <p><a href="tel:+48736036604" style={{ color: '#b8bcbd', textDecoration: 'none', fontSize: '21px' }}>+48 736 036 604</a></p>
          <p><a href="https://sysmo.pl/kontakt/" style={{ color: '#b8bcbd', textDecoration: 'none', fontSize: '21px' }}>Sysmo.pl – rozwiązania IT sp. z o.o.</a></p><br />
          <p><a href="https://www.linkedin.com/company/sysmo-pl-rozwi-zania-it-sp-z-o-o" style={{ color: '#b8bcbd', textDecoration: 'none', fontSize: '21px' }}>Linkedin</a></p>
          <p><a href="https://www.facebook.com/sysmo.rozwiazania.it/" style={{ color: '#b8bcbd', textDecoration: 'none', fontSize: '21px' }}>Facebook</a></p>
        </div>
      </footer>
    </div>
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