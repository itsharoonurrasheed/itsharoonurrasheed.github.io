/**
 * remove_bg_jimp.cjs
 * Flood-fill background removal from corners + edge smoothing.
 * Works on photos with any relatively uniform background colour.
 */
const { Jimp, JimpMime } = require('jimp');
const path = require('path');

const INPUT  = path.join(__dirname, 'haroon.png');
const OUTPUT = path.join(__dirname, 'haroon_nobg.png');

// Colour-distance in RGB space
function colorDist(r1,g1,b1,r2,g2,b2){
  return Math.sqrt((r1-r2)**2+(g1-g2)**2+(b1-b2)**2);
}

async function removeBg(){
  const img = await Jimp.read(INPUT);
  const width  = img.width;
  const height = img.height;
  const data   = img.bitmap.data;

  // Sample background colour from the 4 corners
  const corners = [
    [0,0],[width-1,0],[0,height-1],[width-1,height-1]
  ].map(([x,y])=>{
    const i=(y*width+x)*4;
    return [data[i],data[i+1],data[i+2]];
  });
  const [br,bg,bb] = corners.reduce(([ar,ag,ab],[r,g,b])=>
    [ar+r,ag+g,ab+b],[0,0,0]).map(v=>Math.round(v/4));

  console.log(`Background colour sampled: rgb(${br},${bg},${bb})`);

  const THRESHOLD  = 35;   // Colour distance to classify as background
  const FEATHER    = 15;   // Extra distance for soft edges

  // Flood-fill from corners to mark background pixels
  const visited = new Uint8Array(width*height);
  const queue   = [];

  // Seed from all four corners
  [[0,0],[width-1,0],[0,height-1],[width-1,height-1]].forEach(([x,y])=>{
    const idx = y*width+x;
    if(!visited[idx]){ visited[idx]=1; queue.push(x,y); }
  });

  while(queue.length){
    const y = queue.pop();
    const x = queue.pop();
    const pi = (y*width+x)*4;
    const d  = colorDist(data[pi],data[pi+1],data[pi+2],br,bg,bb);
    if(d > THRESHOLD) continue;

    visited[y*width+x]=2; // 2 = confirmed background

    for(const [nx,ny] of [[x-1,y],[x+1,y],[x,y-1],[x,y+1]]){
      if(nx<0||ny<0||nx>=width||ny>=height) continue;
      const ni=ny*width+nx;
      if(!visited[ni]){ visited[ni]=1; queue.push(nx,ny); }
    }
  }

  // Apply alpha: background → transparent, edges → feathered
  for(let y=0;y<height;y++){
    for(let x=0;x<width;x++){
      const pi = (y*width+x)*4;
      const isBg = visited[y*width+x]===2;
      if(isBg){
        data[pi+3]=0;
        continue;
      }
      // Soft feathering near background neighbours
      const d=colorDist(data[pi],data[pi+1],data[pi+2],br,bg,bb);
      if(d<FEATHER){
        data[pi+3]=Math.round((d/FEATHER)*255);
      }
    }
  }

  await img.write(OUTPUT);
  console.log('✅ Saved:', OUTPUT);
}

removeBg().catch(e=>{ console.error('Error:',e); process.exit(1); });
