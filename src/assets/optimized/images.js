import profile400 from './profile-400.webp';
import profile800 from './profile-800.webp';
import journalfit640 from './journalfit-640.webp';
import journalfit1280 from './journalfit-1280.webp';
import boda640 from './boda-640.webp';
import boda1280 from './boda-1280.webp';
import certificados640 from './certificados-640.webp';
import certificados1280 from './certificados-1280.webp';
import consultora640 from './consultora-640.webp';
import consultora1280 from './consultora-1280.webp';
import peluqueria640 from './peluqueria-640.webp';
import peluqueria1280 from './peluqueria-1280.webp';
import video640 from './video-640.webp';
import video1280 from './video-1280.webp';
import calzadospaula640 from './calzadospaula-640.webp';
import calzadospaula1280 from './calzadospaula-1280.webp';

export default {
calzadospaula: { src: calzadospaula1280, srcSet: `${calzadospaula640} 640w, ${calzadospaula1280} 1280w`, width: 1280, height: 889 },
profile: { src: profile800, srcSet: `${profile400} 400w, ${profile800} 800w`, width: 800, height: 800 },
journalfit: { src: journalfit1280, srcSet: `${journalfit640} 640w, ${journalfit1280} 1280w`, width: 1280, height: 889 },
boda: { src: boda1280, srcSet: `${boda640} 640w, ${boda1280} 1280w`, width: 1280, height: 889 },
certificados: { src: certificados1280, srcSet: `${certificados640} 640w, ${certificados1280} 1280w`, width: 1280, height: 889 },
consultora: { src: consultora1280, srcSet: `${consultora640} 640w, ${consultora1280} 1280w`, width: 1280, height: 683 },
peluqueria: { src: peluqueria1280, srcSet: `${peluqueria640} 640w, ${peluqueria1280} 1280w`, width: 1280, height: 889 },
video: { src: video1280, srcSet: `${video640} 640w, ${video1280} 1280w`, width: 1280, height: 889 }
};
