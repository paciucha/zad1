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
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${id}.pdf`);
    });
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <img src="/logo.png" alt="Logo" style={{ position: 'absolute', top: '20px', left: '20px', width: '100px', height: 'auto' }} />
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
          <img src="/logo2.png" alt="Logo 2" style={{ width: '100px', height: 'auto' }} />
          <p style={{ paddingTop: 0, fontSize: '20px', color: '#e0e0e0' }}>
            Sysmo.pl – rozwiązania IT sp.z o.o.<br />
            NIP: 7822889486<br />
            REGON: 387542528<br />
            KRS: 0000870256
          </p>
        </div>
        <div className="column">
          <h3>Mapa strony</h3>
          <p><a href="https://sysmo.pl/" style={{ color: '#b9bcbd', textDecoration: 'none', fontSize: '20px' }}>Home</a></p>
          <p><a href="https://sysmo.pl/uslugi/" style={{ color: '#b9bcbd', textDecoration: 'none', fontSize: '20px' }}>Usługi</a></p>
          <p><a href="https://sysmo.pl/realizacje/" style={{ color: '#b9bcbd', textDecoration: 'none', fontSize: '20px' }}>Realizacje</a></p>
          <p><a href="https://sysmo.pl/o-nas/" style={{ color: '#b9bcbd', textDecoration: 'none', fontSize: '20px' }}>O nas</a></p>
          <p><a href="https://sysmo.pl/artykuly/" style={{ color: '#b9bcbd', textDecoration: 'none', fontSize: '20px' }}>Artykuły</a></p>
          <p><a href="https://sysmo.pl/faq/" style={{ color: '#b9bcbd', textDecoration: 'none', fontSize: '20px' }}>FAQ</a></p>
          <p><a href="https://zleca.pl/wykonawca/sysmo-aplikacje-mobilne-i-webowe-1601013554-1601006354" style={{ color: '#b9bcbd', textDecoration: 'none', fontSize: '20px' }}>Zleca.pl</a></p>
          <p><a href="https://sysmo.pl/kariera/" style={{ color: '#b9bcbd', textDecoration: 'none', fontSize: '20px' }}>Kariera</a></p>
          <p><a href="https://sysmo.pl/kontakt/" style={{ color: '#b9bcbd', textDecoration: 'none', fontSize: '20px' }}>Kontakt</a></p>
        </div>
        <div className="column">
          <h3>Kontakt</h3>
          <p><a href="mailto:contact@sysmo.pl" style={{ color: '#b9bcbd', textDecoration: 'none', fontSize: '20px' }}>contact@sysmo.pl</a></p>
          <p><a href="tel:+48736036604" style={{ color: '#b9bcbd', textDecoration: 'none', fontSize: '20px' }}>+48 736 036 604</a></p>
          <p><a href="https://sysmo.pl/kontakt/" style={{ color: '#b9bcbd', textDecoration: 'none', fontSize: '20px' }}>Sysmo.pl – rozwiązania IT sp. z o.o.</a></p><br />
          <p><a href="https://www.linkedin.com/company/sysmo-pl-rozwi-zania-it-sp-z-o-o" style={{ color: '#b9bcbd', textDecoration: 'none', fontSize: '20px' }}>Linkedin</a></p>
          <p><a href="https://www.facebook.com/sysmo.rozwiazania.it/" style={{ color: '#b9bcbd', textDecoration: 'none', fontSize: '20px' }}>Facebook</a></p>
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