export interface Station {
  id: string;
  name: string;
  url: string;
  category?: string;
}

export const m3uContent = `#EXTM3U

#EXTINF:-1,AIR Karaikal
https://air.pc.cdn.bitgravity.com/air/live/pbaudio050/chunklist.m3u8

#EXTINF:-1,AIR Kodaikanal
https://air.pc.cdn.bitgravity.com/air/live/pbaudio051/playlist.m3u8

#EXTINF:-1,AIR Coimbtore
https://air.pc.cdn.bitgravity.com/air/live/pbaudio017/playlist.m3u8

#EXTINF:-1,AIR Trichy
https://air.pc.cdn.bitgravity.com/air/live/pbaudio041/chunklist.m3u8

#EXTINF:-1,AIR Chennai
https://air.pc.cdn.bitgravity.com/air/live/pbaudio022/playlist.m3u8

#EXTINF:-1,AIR Tamil
https://air.pc.cdn.bitgravity.com/air/live/pbaudio025/playlist.m3u8

#EXTINF:-1,RADIO RAAGAM
https://c2.radioboss.fm:9099/stream

#EXTINF:-1,kummalam FM
https://kummalam.stream.laut.fm/kummalam

#EXTINF:-1,isaiaruvi fm
https://cp1.hostcrate.com/8910/stream

#EXTINF:-1,Palaiya Padal FM
https://a9oldhits-a9media.radioca.st/stream

#EXTINF:-1,Suryan FM
https://radio.lotustechnologieslk.net:8006/;stream.mp3

#EXTINF:-1,Thenral Radio
https://worldradio.online/proxy/?q=http://220.247.227.20:8000/Threndralstream

#EXTINF:-1,Nesaganam
https://usa9.fastcast4u.com/proxy/nesaganam?mp=/1

#EXTINF:-1,Pollachi FM
https://stream.zeno.fm/f29eh57d3qzuv

#EXTINF:-1,Puthu Paadal Radio
https://stream.zeno.fm/zkpew7yxd5zuv

#EXTINF:-1,big fm
https://listen.openstream.co/4434/audio

#EXTINF:-1,hello FM
https://stream.rcast.net/72516

#EXTINF:-1,radiomirchi fm
https://eu8.fastcast4u.com/proxy/clyedupq?mp=%2F1?aw_0_req_lsid=2c0fae177108c9a42a7cf24878625444

#EXTINF:-1,Aniruth FM
https://psrlive1.listenon.in/anirud

#EXTINF:-1,SPB FM
https://stream.zeno.fm/u0ze9rfzyp8uv

#EXTINF:-1,Yuvan FM
https://psrlive1.listenon.in/ysr?station=ysrradio

#EXTINF:-1,AR Rahman FM
http://stream.zeno.fm/ihpr0rqzoxquv

#EXTINF:-1,ILAYARAJA FM
http://stream.zeno.fm/qfd4vokvu3dvv

#EXTINF:-1,KS Chitra
https://stream.zeno.fm/aad4e51qz7zuv

#EXTINF:-1,Imman Radio
https://stream.zeno.fm/6apkrxlnxudtv

#EXTINF:-1,Mano Radio
https://stream.zeno.fm/maokuvdskhnuv

#EXTINF:-1,GV Prakash Radio
https://stream.zeno.fm/v4ghrktawp8uv

#EXTINF:-1,Hariharan Radio
https://stream.zeno.fm/g20bs7hu0uhvv

#EXTINF:-1,Unnikrishnan Radio
https://psrlive1.listenon.in/unni?station=unnikrishanradio

#EXTINF:-1,Mellisai Mannar Radio
http://stream.zeno.fm/x7wc1xgllvsvv

#EXTINF:-1,Vijay Radio
https://psrlive1.listenon.in/vijay?station=vijayradio

#EXTINF:-1,Ajith FM
https://psrlive1.listenon.in/ajith?station=ajithradio

#EXTINF:-1,Super Star Radio
https://stream.zeno.fm/g20bs7hu0uhvv

#EXTINF:-1,Kamal Radio
https://stream.zeno.fm/we99zw61w0hvv

#EXTINF:-1,Sivaji Radio
https://stream.zeno.fm/kq88hd71w0hvv

#EXTINF:-1,MGR Radio
https://stream.zeno.fm/0muspvd4138uv

#EXTINF:-1,Thala Thalapathy Radio
https://stream.zeno.fm/yewqc3huttzuv

#EXTINF:-1,Comedy Radio
http://stream.zeno.fm/baam0v50pg0uv

#EXTINF:-1,GV Prakash Radio
https://stream.zeno.fm/v4ghrktawp8uv

#EXTINF:-1,Bakthi FM
http://stream.zeno.fm/0p1p4t7043duv

#EXTINF:-1,OM FM
https://spserver.sscast2u.in/ammanradio/stream

#EXTINF:-1,Ayyappa Tamil FM
http://stream.zeno.fm/up95n0xf84zuv

#EXTINF:-1,Murugan FM
http://stream.zeno.fm/0r7u1fcn8mruv

#EXTINF:-1,hanifa FM
https://usa8.fastcast4u.com/proxy/isaimurasufm?mp=/1

#EXTINF:-1,TNTG FM
http://stream.zeno.fm/6fhdur9wn0hvv`;

export const parseM3U = (content: string): Station[] => {
  const lines = content.split('\n');
  const stations: Station[] = [];
  let currentName = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('#EXTINF:')) {
      const parts = line.split(',');
      if (parts.length > 1) {
        currentName = parts.slice(1).join(',').trim();
      }
    } else if (line && !line.startsWith('#')) {
      if (currentName) {
        stations.push({
          id: `station-${stations.length}`,
          name: currentName,
          url: line
        });
        currentName = '';
      }
    }
  }
  return stations;
};

export const stations = parseM3U(m3uContent);
