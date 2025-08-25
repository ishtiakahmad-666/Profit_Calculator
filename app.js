const $ = (id) => document.getElementById(id);
['Selling price (per unit)', data.sp],
['Cost price (per unit)', data.cp],
['Quantity', data.qty],
['Discount %', data.disc],
['Tax %', data.taxPct],
['Overheads', data.oh],
['Effective SP', data.effSp],
['Revenue', data.revenue],
['Variable cost', data.varCost],
['Tax expense', data.taxExpense],
['Total cost', data.totalCost],
['Profit', data.profit],
['Profit per unit', data.profitPerUnit],
['Profit margin %', data.profitMargin],
['Markup %', data.markup],
['Contribution per unit', data.contributionPerUnit],
['Break-even units', data.beUnits];
const csv = rows.map(r => r.map(c => '"' + String(c).replace(/"/g,'""') + '"').join(',')).join('');
const blob = new Blob([csv], { type: 'text/csv' });
const a = document.createElement('a');
a.href = URL.createObjectURL(blob);
a.download = 'profit-result.csv';
document.body.appendChild(a);
a.click();
a.remove();
URL.revokeObjectURL(a.href);


function shareResult(data) {
const txt = `Profit result:
Currency: ${data.cur}
Profit: ${formatMoney(data.profit, data.cur)}
Revenue: ${formatMoney(data.revenue, data.cur)}
Profit margin: ${data.profitMargin.toFixed(2)}%


Open: ${data.url}`;
if (navigator.share) {
navigator.share({ title: 'Profit calculation', text: txt, url: data.url }).catch(()=>{});
} else if (navigator.clipboard) {
navigator.clipboard.writeText(data.url).then(()=>{
$('copyNotice').textContent = 'Link copied to clipboard!';
setTimeout(()=>$('copyNotice').textContent = '', 2500);
}).catch(()=> alert('Copy failed — here is the link:' + data.url));
} else {
prompt('Copy this link:', data.url);
}
}


// Bind buttons
document.addEventListener('DOMContentLoaded', () => {
loadFromURL();
$('year').textContent = new Date().getFullYear();


$('calcBtn').addEventListener('click', ()=>{
const data = calculate();
window.__lastCalc = data;
});


$('resetBtn').addEventListener('click', ()=>{
resetAll();
window.__lastCalc = null;
});


$('printBtn').addEventListener('click', ()=>{
if (!window.__lastCalc) calculate();
printView();
});


$('downloadBtn').addEventListener('click', ()=>{
const data = window.__lastCalc || calculate();
downloadCSV(data);
});


$('shareBtn').addEventListener('click', ()=>{
const data = window.__lastCalc || calculate();
shareResult(data);
});


['sp','cp','qty','discount','tax','overhead','currency'].forEach(id => {
$(id).addEventListener('keydown', (e)=>{ if (e.key === 'Enter') { e.preventDefault(); $('calcBtn').click(); } });
});


const p = new URLSearchParams(location.search);
if (p.toString()) { const data = calculate(); window.__lastCalc = data; }
});