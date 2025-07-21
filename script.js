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
    <input type="text" class="desc">
    <label>Cantidad:</label>
    <input type="number" class="cant" value="1" min="1">
    <label>Precio Unitario:</label>
    <input type="number" class="precio" value="0" min="0">
    <button type="button" class="eliminar-btn">🗑️ Eliminar</button>
  `;

  div.querySelector(".eliminar-btn").onclick = () => div.remove();
  container.appendChild(div);
}

document.getElementById("budgetForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const { jsPDF } = window.jspdf;
  const cliente = document.getElementById("cliente").value;
  const telefono = document.getElementById("telefono").value;

  const items = Array.from(document.querySelectorAll('.item')).map(div => {
    return {
      desc: div.querySelector('.desc').value.trim(),
      cant: parseFloat(div.querySelector('.cant').value),
      precio: parseFloat(div.querySelector('.precio').value)
    };
  }).filter(it => it.desc && !isNaN(it.cant) && !isNaN(it.precio));

  const doc = new jsPDF();
  const margin = 10;
  let y = margin;

  // Logo
  doc.addImage(COMPANY_INFO.logo, 'JPEG', margin, y, 40, 20);

  // Empresa
  doc.setFontSize(16);
  doc.text(COMPANY_INFO.name, margin + 50, y + 10);
  doc.setFontSize(10);
  doc.text(`Tel: ${COMPANY_INFO.phone}`, margin + 50, y + 16);

  // Fecha
  const fecha = new Date().toLocaleDateString();
  doc.text(`Fecha: ${fecha}`, 160, y + 10, { align: 'right' });

  y += 30;
  doc.setFontSize(12);
  doc.setDrawColor(0);
  doc.setFillColor(230, 230, 230);
  doc.rect(margin, y - 6, 190 - 2 * margin, 8, 'F');
  doc.text('Datos del Cliente', margin + 2, y);

  y += 10;
  doc.setFontSize(11);
  doc.text(`Nombre: ${cliente}`, margin, y);
  doc.text(`Teléfono: ${telefono}`, margin, y + 8);

  // Título cotización
  y += 20;
  doc.setFontSize(12);
  doc.setFillColor(230, 230, 230);
  doc.rect(margin, y - 6, 190 - 2 * margin, 8, 'F');
  doc.text('Detalle de la Cotización', margin + 2, y);

  // Encabezado tabla
  y += 10;
  const colX = [margin, 80, 110, 140, 170];
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text("Descripción", colX[0], y);
  doc.text("Cant.", colX[1], y);
  doc.text("P.Unit.", colX[2], y);
  doc.text("Subtotal", colX[3], y);
  doc.setFont(undefined, 'normal');
  y += 6;

  let total = 0;
  items.forEach(it => {
    const lineTot = it.cant * it.precio;
    total += lineTot;
    doc.text(it.desc, colX[0], y);
    doc.text(String(it.cant), colX[1], y);
    doc.text(`$${it.precio.toFixed(2)}`, colX[2], y);
    doc.text(`$${lineTot.toFixed(2)}`, colX[3], y);
    y += 6;
    if (y > 270) {
      doc.addPage();
      y = margin;
    }
  });

  // Línea separadora
  doc.setDrawColor(0);
  doc.line(margin, y, 190 - margin, y);
  y += 8;

  doc.setFont(undefined, 'bold');
  doc.text(`Total: $${total.toFixed(2)}`, colX[3], y);
  doc.setFont(undefined, 'normal');

  // Guardar PDF
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const fileName = `Presupuesto_${cliente}.pdf`;

  const link = document.createElement('a');
  link.href = pdfUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();

  // Compartir si se puede
  const shareBtn = document.getElementById('shareBtn');
  shareBtn.style.display = 'block';
  shareBtn.onclick = async () => {
    const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file] });
    } else {
      alert('Este dispositivo no soporta compartir archivos.');
    }
  };
});
