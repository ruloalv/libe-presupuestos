const COMPANY_INFO = {
  name: "LIBE Carpintería",
  phone: "2914434571",
  logo: "LIBE.jpg"
};
let itemCount = 0;

function agregarItem() {
  const container = document.getElementById('itemsContainer');
  const div = document.createElement('div');
  div.classList.add('item');
  div.innerHTML = `
    <label>Descripción:</label>
    <input type="text" class="desc" required>
    <label>Cantidad:</label>
    <input type="number" class="cant" value="1" min="1" required>
    <label>Precio Unitario:</label>
    <input type="number" class="precio" value="0" min="0" required>
  `;
  container.appendChild(div);
}

document.getElementById("budgetForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const cliente = document.getElementById("cliente").value;
  const telefono = document.getElementById("telefono").value;
  const items = Array.from(document.querySelectorAll('.item')).map(div => ({
    desc: div.querySelector('.desc').value,
    cant: +div.querySelector('.cant').value,
    precio: +div.querySelector('.precio').value
  }));
  const doc = new jspdf.jsPDF();
  doc.addImage(COMPANY_INFO.logo, 'JPEG', 10, 10, 40, 20);
  doc.setFontSize(16);
  doc.text(COMPANY_INFO.name, 60, 20);
  doc.setFontSize(12);
  doc.text(`Tel: ${COMPANY_INFO.phone}`, 60, 28);
  doc.text(`Cliente: ${cliente}`, 10, 50);
  doc.text(`Teléfono: ${telefono}`, 10, 58);
  let y = 70, tot=0;
  items.forEach(it => {
    doc.text(`${it.desc}`, 10, y);
    doc.text(`${it.cant}`, 110, y);
    doc.text(`$${it.precio.toFixed(2)}`, 130, y);
    const lineTot = it.cant * it.precio;
    tot += lineTot;
    doc.text(`$${lineTot.toFixed(2)}`, 160, y);
    y += 8;
  });
  doc.text(`Total: $${tot.toFixed(2)}`, 10, y+10);

  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = pdfUrl;
  link.download = `Presupuesto_${cliente}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();

  const shareBtn = document.getElementById('shareBtn');
  shareBtn.style.display = 'block';
  shareBtn.onclick = async () => {
    if (navigator.canShare && navigator.canShare({ files: [new File([pdfBlob], link.download, { type: 'application/pdf' })] })) {
      await navigator.share({ files: [new File([pdfBlob], link.download, { type: 'application/pdf' })] });
    } else {
      alert('Compartir no compatible en este dispositivo');
    }
  };
});
