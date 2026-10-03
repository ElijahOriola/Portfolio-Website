document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('screenTransitionOverlay');
  const mainWebsite = document.getElementById('mainWebsiteWrapper');
  const resumeWorkspace = document.getElementById('resumeWorkspace');
  const chatWorkspace = document.getElementById('chatWorkspace'); // Added chat workspace reference
  const resumeLinks = document.querySelectorAll('a[href="#resume"]');
  const chatLinks = document.querySelectorAll('a[href="#chatspace"]'); // Added chat links reference
  const resumeNavLinks = document.querySelectorAll('.resume-nav-link');
  const downloadBtn = document.getElementById('downloadResumeBtn');
  const cvBtn = document.getElementById('cvBtn');          
  const aboutCvBtn = document.getElementById('aboutCvBtn'); 

  const allResumeNavItems = document.querySelectorAll('a[href="#resume"]');

  function openResumeWorkspace(e) {
    e.preventDefault();
    allResumeNavItems.forEach(item => item.classList.add('active'));

    if (overlay && mainWebsite && resumeWorkspace) {
      overlay.classList.add('active');

      setTimeout(() => {
        mainWebsite.classList.add('hidden');
        if (chatWorkspace) chatWorkspace.classList.remove('active'); // Ensure chat is hidden
        resumeWorkspace.classList.add('active');
        window.scrollTo(0, 0);

        setTimeout(() => {
          overlay.classList.remove('active');
        }, 150);
      }, 350);
    }
  }

  resumeLinks.forEach(link => link.addEventListener('click', openResumeWorkspace));
  if (cvBtn) cvBtn.addEventListener('click', openResumeWorkspace);
  if (aboutCvBtn) aboutCvBtn.addEventListener('click', openResumeWorkspace);

  // FIXED: Explicitly handle switching from Resume to Chat tab to prevent jumping to home
  chatLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      allResumeNavItems.forEach(item => item.classList.remove('active'));

      if (overlay && mainWebsite && resumeWorkspace && chatWorkspace) {
        overlay.classList.add('active');

        setTimeout(() => {
          resumeWorkspace.classList.remove('active');
          mainWebsite.classList.add('hidden');
          chatWorkspace.classList.add('active');
          window.scrollTo(0, 0);

          setTimeout(() => {
            overlay.classList.remove('active');
          }, 150);
        }, 350);
      }
    });
  });

  resumeNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-target');
      allResumeNavItems.forEach(item => item.classList.remove('active'));

      if (overlay && mainWebsite && resumeWorkspace) {
        overlay.classList.add('active');

        setTimeout(() => {
          resumeWorkspace.classList.remove('active');
          if (chatWorkspace) chatWorkspace.classList.remove('active');
          mainWebsite.classList.remove('hidden');
          
          const targetSection = document.getElementById(targetId);
          if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'auto' });
          } else {
            window.scrollTo(0, 0);
          }

          setTimeout(() => {
            overlay.classList.remove('active');
          }, 150);
        }, 350);
      }
    });
  });

  if (downloadBtn) {
    downloadBtn.addEventListener('click', async () => {
      const resumeContent = document.getElementById('resumeCardArea');

      if (!resumeContent || typeof window.html2canvas !== 'function' || typeof window.jspdf?.jsPDF !== 'function') {
        alert('PDF download is unavailable. Please check your internet connection and try again.');
        return;
      }

      const originalButtonContent = downloadBtn.innerHTML;
      downloadBtn.disabled = true;
      downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing PDF...';

      try {
        const resumeCanvas = await window.html2canvas(resumeContent, {
          scale: 2,
          useCORS: true,
          scrollX: 0,
          scrollY: 0,
          windowWidth: 1280,
          windowHeight: 900
        });
        const pdfDocument = new window.jspdf.jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' });
        const pageMargin = 32;
        const availableWidth = pdfDocument.internal.pageSize.getWidth() - pageMargin * 2;
        const availableHeight = pdfDocument.internal.pageSize.getHeight() - pageMargin * 2;
        const fitScale = Math.min(availableWidth / resumeCanvas.width, availableHeight / resumeCanvas.height);
        const imageWidth = resumeCanvas.width * fitScale;
        const imageHeight = resumeCanvas.height * fitScale;
        const imageX = (pdfDocument.internal.pageSize.getWidth() - imageWidth) / 2;

        pdfDocument.addImage(resumeCanvas.toDataURL('image/jpeg', 0.98), 'JPEG', imageX, pageMargin, imageWidth, imageHeight);
        const pdfBlob = pdfDocument.output('blob');

        const downloadUrl = URL.createObjectURL(pdfBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadUrl;
        downloadLink.download = 'Oriola-Olaoluwa-Resume.pdf';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove();
        window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      } catch (error) {
        console.error('Unable to generate the resume PDF:', error);
        alert('The resume PDF could not be generated. Please try again.');
      } finally {
        downloadBtn.disabled = false;
        downloadBtn.innerHTML = originalButtonContent;
      }
    });
  }
});