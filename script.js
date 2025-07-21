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
  doc.addImage(COMPANY_INFO.logo, 'JPEG', 10, 10, 40, 20);
  doc.setFontSize(16);
  doc.text(COMPANY_INFO.name, 60, 20);
  doc.setFontSize(12);
  doc.text(`Tel: ${COMPANY_INFO.phone}`, 60, 28);
  doc.text(`Cliente: ${cliente}`, 10, 50);
  doc.text(`Teléfono: ${telefono}`, 10, 58);

  let y = 70;
  let total = 0;
  items.forEach(it => {
    const lineTot = it.cant * it.precio;
    total += lineTot;
    doc.text(`${it.desc}`, 10, y);
    doc.text(`${it.cant}`, 110, y);
    doc.text(`$${it.precio.toFixed(2)}`, 130, y);
    doc.text(`$${lineTot.toFixed(2)}`, 160, y);
    y += 8;
  });

  doc.text(`Total: $${total.toFixed(2)}`, 10, y + 10);

  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const fileName = `Presupuesto_${cliente}.pdf`;

  const link = document.createElement('a');
  link.href = pdfUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();

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

