document.addEventListener('DOMContentLoaded', function() {
  AOS.init({duration: 800, once: true});

  // 1. TYPING EFFECT
  const typingText = document.getElementById('typing-text');
  const words = ["Internet Rumah Stabil", "Nonton Tanpa Buffering", "Gaming Paling Lancar", "Kerja Dari Rumah Aman"];
  let wordIndex = 0;

  function type() {
    const currentWord = words[wordIndex];
    const typingSpeed = 80;
    const pauseEnd = 1000;
    let i = 0;
    const typingInterval = setInterval(() => {
      typingText.textContent = currentWord.substring(0, i + 1);
      i++;
      if (i === currentWord.length) {
        clearInterval(typingInterval);
        setTimeout(() => {
          typingText.textContent = '';
          wordIndex = (wordIndex + 1) % words.length;
          setTimeout(type, 300);
        }, pauseEnd);
      }
    }, typingSpeed);
  }
  type();

  // 2. COUNTER PELANGGAN
  const counter = document.getElementById('counterPelanggan');
  let count = 0; const target = 350;
  const updateCount = () => { if (count < target) { count += 5; counter.innerText = count; requestAnimationFrame(updateCount); } else { counter.innerText = target; } };
  const observer = new IntersectionObserver((entries) => { if(entries[0].isIntersecting){ updateCount(); observer.disconnect(); }});
  observer.observe(document.getElementById('social-proof'));

  // 3. CEK JANGKAUAN AREA
  const areaTersedia = ['cibarusah jaya', 'bojong', 'wibawamulya', 'ridogalih'];
  document.getElementById('btnCekArea').addEventListener('click', () => {
    const val = document.getElementById('inputArea').value.toLowerCase();
    const ditemukan = areaTersedia.some(area => val.includes(area));
    const hasilCek = document.getElementById('hasilCekArea');
    if(ditemukan){
      hasilCek.innerHTML = '<span style="color:#22c55e"><i class="bi bi-check-circle"></i> Tersedia di area Anda! Silahkan daftar</span>';
      fbq('track', 'Lead');
    } else {
      hasilCek.innerHTML = '<span style="color:#fbbf24"><i class="bi bi-info-circle"></i> Maaf belum tercover. Masukkan ke daftar antrian</span>';
    }
  });

  // 4. AUTO SELECT PAKET DARI TOMBOL
  document.querySelectorAll('.btn-paket').forEach(btn => {
    btn.addEventListener('click', function() {
      document.getElementById('selectPaket').value = this.dataset.paket;
    });
  });

  // 5. FORM KE GOOGLE SHEET + TELEGRAM
  document.getElementById('formDaftar').addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('button[type=submit]');
    btn.innerText = "Mengirim...";
    btn.disabled = true;

    let wa = this.wa.value;
    if(wa.startsWith('08')) wa = '62' + wa.substring(1);

    const formData = {
      nama: this.nama.value,
      wa: wa,
      alamat: this.alamat.value,
      paket: this.paket.value
    };

    fetch('https://script.google.com/macros/s/AKfycbzT1NgBeeqJvs1CQxfqLhFd9IWdnwMMW-XGziGIf4IVqbZvuWdiBdFUy5C4G3bzfzmLmw/exec', {
      method: 'POST',
      body: JSON.stringify(formData)
    })
   .then(response => response.text())
   .then(result => {
      if(result === "OK"){
        document.getElementById('pesanSukses').innerText = "✅ Pendaftaran Berhasil! Tim WBM.NET akan menghubungi Anda 1x24 jam";
        document.getElementById('pesanSukses').classList.remove('d-none');
        this.reset();
        if(typeof fbq!== 'undefined') fbq('track', 'Lead');
        if(typeof gtag!== 'undefined') gtag('event', 'submit_form');
      } else {
        alert("Gagal: " + result);
      }
    })
   .catch(error => {
      alert("Gagal kirim. Cek koneksi/CORS");
      console.log(error);
    })
   .finally(() => {
      btn.innerText = "Kirim Pendaftaran";
      btn.disabled = false;
    });
  });

  // 6. SPEEDTEST SIMULASI
  const startBtn = document.getElementById('start-test');
  const popup = document.getElementById('speedtestPopup');
  startBtn.addEventListener('click', () => {
    let d=0, u=0, p=0;
    const interval = setInterval(() => {
      d += Math.random()*50; u += Math.random()*20; p = Math.floor(Math.random()*20)+5;
      document.getElementById('download-speed').innerText = d.toFixed(2);
      document.getElementById('upload-speed').innerText = u.toFixed(2);
      document.getElementById('ping-speed').innerText = p;
      if(d > 100){ clearInterval(interval); showPopup(d); }
    }, 50);
  });
  function showPopup(speed){
    document.getElementById('hasilDownload').innerText = speed.toFixed(0);
    let rekomendasi = speed < 15? "Paket 15 Mbps sangat cocok untuk Anda" : speed < 25? "Paket 20 Mbps recommended" : "Paket 25 Mbps untuk performa maksimal";
    document.getElementById('rekomendasiText').innerText = rekomendasi;
    popup.style.display = 'flex';
  }
  document.querySelector('.close-popup').addEventListener('click', () => popup.style.display = 'none');

  // 7. STATUS BUKA/TUTUP OTOMATIS
  function cekStatusToko() {
    const statusEl = document.getElementById('statusToko');
    if(!statusEl) return;
    const now = new Date();
    const jam = now.getHours();
    const isBuka = jam >= 8 && jam < 21;
    if(isBuka){
      statusEl.className = 'status-toko status-buka';
      statusEl.innerHTML = '<i class="bi bi-circle-fill"></i> KANTOR BUKA';
    } else {
      statusEl.className = 'status-toko status-tutup';
      statusEl.innerHTML = '<i class="bi bi-circle-fill"></i> KANTOR TUTUP';
    }
  }
  cekStatusToko();
  setInterval(cekStatusToko, 60000);

  // 8. COOKIE BANNER
  if(!localStorage.getItem('cookie')) document.getElementById('cookieBanner').classList.remove('d-none');
});
