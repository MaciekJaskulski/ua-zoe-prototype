import { useState, useRef, useEffect } from "react";

/* ─── COLOURS ──────────────────────────────────────────────────────────────── */
const UA_RED    = "#c8102e";
const UA_BLACK  = "#1a1a1a";
const UA_WHITE  = "#ffffff";
const UA_GRAY   = "#f5f5f5";
const UA_BORDER = "#e0e0e0";
const UA_DARK   = "#111111";
const UA_GREEN  = "#2e7d32";

/* ─── SHOE DATA ─────────────────────────────────────────────────────────────── */
const SHOES = {
  lokedi:   { id:"lokedi",   name:"UA Velociti Elite 3 'Sharon Lokedi' PE", sub:"Unisex Running Shoes. Peak Speed, Carbon Plate",       price:"£225", tags:["HOVR+foam","Long distance"],                   colors:["#a8e63d","#e8e020","#f5c518"], img:"/images/lokedi.png", link:"https://und3rarmour-zoe-pdp.vercel.app/#" },
  distance: { id:"distance", name:"UA Velociti Distance",                   sub:"Men's Running Shoes. Long Runs, Cushioned",             price:"£145", tags:["Road","HOVR+foam","298g","Long distance"],     colors:["#1565c0","#f5c518","#4caf50","#222","#555"],               img:"https://underarmour.scene7.com/is/image/Underarmour/6006030-402_DEFAULT?rp=standard-20pad%7CcartFullDesktop&qlt=85&bgc=f0f0f0&wid=500&hei=600&size=476%2C580&op_usm=1.75%2C0.3%2C2%2C0" },
  pace:     { id:"pace",     name:"UA Velociti Pace",                       sub:"Men's Running Shoes. Daily Miles, Lightweight",         price:"£100", tags:["HOVR+foam","Lightweight"],                     colors:["#e53935","#f5c518","#4fc3f7","#ff8a65","#9e9e9e","#222","#78909c"], img:"https://underarmour.scene7.com/is/image/Underarmour/6009107-001_DEFAULT?rp=standard-20pad%7CcartFullDesktop&qlt=85&bgc=f0f0f0&wid=500&hei=600&size=476%2C580&op_usm=1.75%2C0.3%2C2%2C0" },
  charged:  { id:"charged",  name:"UA Charged+ Turbulence 3",               sub:"Men's Running Shoes",                                  price:"£85",  tags:["Charged","Daily trainer"],                    colors:["#fff","#222","#e53935"],                   img:"https://underarmour.scene7.com/is/image/Underarmour/3027000-100_DEFAULT?rp=standard-20pad%7CcartFullDesktop&qlt=85&bgc=f0f0f0&wid=500&hei=600&size=476%2C580&op_usm=1.75%2C0.3%2C2%2C0" },
  haloRacer:{ id:"haloRacer",name:"UA Halo Racer",                          sub:"Men's Running Shoes",                                  price:"£155", tags:["Neutral","Road"],                              colors:["#ff8a65","#fff","#9e9e9e"],                img:"https://underarmour.scene7.com/is/image/Underarmour/3027199-600_DEFAULT?rp=standard-20pad%7CcartFullDesktop&qlt=85&bgc=f0f0f0&wid=500&hei=600&size=476%2C580&op_usm=1.75%2C0.3%2C2%2C0" },
  haloSE:   { id:"haloSE",   name:"UA Halo Runner SE",                      sub:"Men's Running Shoes",                                  price:"£135", tags:["Cushioned","Road"],                            colors:["#9e9e9e","#78909c","#fff","#555"],         img:"https://underarmour.scene7.com/is/image/Underarmour/3027578-100_DEFAULT?rp=standard-20pad%7CcartFullDesktop&qlt=85&bgc=f0f0f0&wid=500&hei=600&size=476%2C580&op_usm=1.75%2C0.3%2C2%2C0" },
  spd:      { id:"spd",      name:"UA Velociti SPD",                        sub:"Men's Running Shoes. Tempo & Track, Lightweight",      price:"£120", tags:["Lightweight","Speed"],                        colors:["#4fc3f7","#e53935","#f5c518","#4caf50","#222"], img:"https://underarmour.scene7.com/is/image/Underarmour/6000007-006_DEFAULT?rp=standard-20pad%7CcartFullDesktop&qlt=85&bgc=f0f0f0&wid=500&hei=600&size=476%2C580&op_usm=1.75%2C0.3%2C2%2C0" },
  rogue:    { id:"rogue",    name:"UA Charged+ Rogue 6",                    sub:"Men's Running Shoes",                                  price:"£75",  tags:["Charged","Road"],                              colors:["#e53935","#fff","#78909c","#ff8a65"],      img:"https://underarmour.scene7.com/is/image/Underarmour/3027000-800_DEFAULT?rp=standard-20pad%7CcartFullDesktop&qlt=85&bgc=f0f0f0&wid=500&hei=600&size=476%2C580&op_usm=1.75%2C0.3%2C2%2C0" },
  explor:   { id:"explor",   name:"UA EXPLOR Trail",                        sub:"Unisex Shoes",                                         price:"£135", tags:["Trail","Grip"],                                colors:["#4caf50","#222","#78909c"],                img:"https://underarmour.scene7.com/is/image/Underarmour/3027199-001_DEFAULT?rp=standard-20pad%7CcartFullDesktop&qlt=85&bgc=f0f0f0&wid=500&hei=600&size=476%2C580&op_usm=1.75%2C0.3%2C2%2C0" },
};

// ALL 64 — wide mix, no clear theme
const GRID_ALL = [
  SHOES.haloSE, SHOES.explor, SHOES.charged, SHOES.rogue,
  SHOES.spd, SHOES.haloRacer, SHOES.pace, SHOES.lokedi, SHOES.distance,
];
// ROAD 24 — road-relevant shoes, explor (trail) removed, reordered
const GRID_ROAD = [
  SHOES.distance, SHOES.haloRacer, SHOES.charged,
  SHOES.pace, SHOES.spd, SHOES.lokedi,
  SHOES.haloSE, SHOES.rogue,
];
// MARATHON 10 — distance-focused, lightweight, only road shoes
const GRID_MARATHON = [
  SHOES.lokedi, SHOES.distance, SHOES.pace,
  SHOES.spd, SHOES.haloRacer,
];
// FINAL 5 — best matches
const GRID_FINAL = [
  SHOES.lokedi, SHOES.distance, SHOES.pace,
  SHOES.charged, SHOES.haloRacer,
];

/* ─── RAIN DETECTION ────────────────────────────────────────────────────────── */
function isRainQ(t){
  const s=t.toLowerCase();
  return s.includes("rain")||s.includes("wet")||s.includes("water")||s.includes("damp")||s.includes("weather")||s.includes("drizzle")||s.includes("downpour")||s.includes("rainy")||s.includes("moisture");
}
const RAIN_ANSWER=`Neither shoe is built exclusively for wet weather, but they handle it differently.

UA Velociti Distance: The breathable mesh upper absorbs water in heavy rain, adding a little weight mid-run. The rubber outsole provides solid grip on wet tarmac for training runs — most road runners find it perfectly usable in light to moderate rain.

UA Velociti Elite 3 'Lokedi' PE: The Leno weave upper is more resistant to water absorption than standard mesh, keeping the shoe lighter for longer in wet conditions. The outsole was specifically micro-tuned for traction at top speed, including on wet roads — UA designed it to hold speed even when the road surface is slick.

For race-day conditions that might turn wet, the Lokedi PE has the edge. For everyday wet-weather training, the Distance is more than adequate — just expect it to feel a touch heavier after a downpour.`;

/* ─── CONVERSATION SCRIPT ───────────────────────────────────────────────────── */
// gridState: null | 'road' | 'marathon' | 'final'
const STEPS = [
  { id:0,  from:"zoe",  text:"Hey! I'm Zoe — I can help you find the right running shoe. Are you shopping for something specific, or would you like me to ask you a few quick questions to find your best match?", chips:["Help me find the right shoe","I already know what I want","Just browsing"] },
  { id:1,  from:"user", text:"Help me find the right shoe" },
  { id:2,  from:"zoe",  text:"What kind of running do you mainly do?", chips:["Road running","Trail/off-road","Treadmill","Mix of everything"] },
  { id:3,  from:"user", text:"Road running", gridState:"road" },
  { id:4,  from:"zoe",  text:"Do you have any goal right now?", chips:["Training for a marathon","Daily miles, staying fit","Speed work","Just getting started"] },
  { id:5,  from:"user", text:"Training for a marathon", gridState:"marathon" },
  { id:6,  from:"zoe",  text:"Last one — do you have any specific comfort needs? Things like arch support or a wider fit can really matter over marathon distances.", chips:["Arch support/flat feet","Wide fit","Stability/overpronation","No specific needs"] },
  { id:7,  from:"user", text:"No specific needs", gridState:"final" },
  { id:8,  from:"zoe",  text:"I found 5 shoes best matching your needs", suggestedQs:["What is UA HOVR?","How does the sizing run?","Will it hold up for a full marathon?"] },
  { id:9,  from:"user", text:"What is UA HOVR?" },
  { id:10, from:"zoe",  text:"HOVR is UA's signature cushioning technology and it's the main reason their long-distance shoes feel different from the competition.\n\nUA HOVR — how it works:\nAbsorbs impact on landing — the foam compresses under your bodyweight, cushioning your heel and midfoot on every stride. Over 30–42km, this dramatically reduces accumulated stress on your joints.\n\nReturns energy on push-off — rather than deadening the impact, HOVR snaps back and propels you forward. Runners consistently describe it as \"springy but controlled.\"", followUp:"Are there any alternatives?" },
  { id:11, from:"user", text:"Are there any alternatives?" },
  { id:12, from:"zoe",  text:"Here are two others worth knowing about — both from the Velociti collection, both with HOVR, but built for different moments in your training:\n\n• UA Velociti Elite 3 'Sharon Lokedi' PE — £225. Race-day shoe. Carbon fibre plate + HOVR+ foam. Built for race day speed.\n\n• UA Velociti Pace — £100. Daily trainer. HOVR cushioning for everyday miles.", suggestedAction:"Can you compare all of them?" },
  { id:13, from:"user", text:"Can you compare all of them?" },
  { id:14, from:"zoe",  text:"Both shoes share HOVR+ superfoam, but are built for entirely different moments.\n\nThe Distance is engineered to go further — full-length HOVR+ foam balancing responsiveness and stability, with extra foam in the heel to protect hips and knees over long distances. 298g, 6mm drop, £145.\n\nThe Lokedi PE is built for one purpose: winning on race day — carbon fibre plate for explosive lift-offs, ultra-responsive HOVR+ foam, Leno weave upper for locked-in near-weightless fit. 221g, 2mm drop, £225.\n\nSame foam, different jobs — the Distance protects you through the training block, the Lokedi PE propels you through the race.", suggestedQs:["How does the extra heel cushioning protect your hips and knees?","Does the 6mm drop suit runners from maximalist shoes?","Can I use the Distance for both easy and long runs?"], showModal:true },
];

/* ─── NAV ───────────────────────────────────────────────────────────────────── */
function Nav({ onSearchFocus, searchQuery, setSearchQuery, onSearchSubmit, searchActive }) {
  const inputRef = useRef(null);
  useEffect(()=>{ if(searchActive && inputRef.current) inputRef.current.focus(); },[searchActive]);
  return (
    <div style={{position:"sticky",top:0,zIndex:200,fontFamily:"Inter,sans-serif"}}>
      {/* Banner */}
      <div style={{background:"#000",textAlign:"center",padding:"7px 0",fontSize:12,color:"#bbb",letterSpacing:.4}}>
        FREE HOME DELIVERY OVER £50 | 60 DAYS RETURNS
        <span style={{position:"absolute",right:24,top:7,fontSize:12,color:"#bbb",display:"flex",gap:16}}>
          <span>Need Help?</span><span>🇬🇧 GB ▾</span><span>English</span><span>Register | Log In</span>
        </span>
      </div>
      {/* Main row */}
      <div style={{background:"#000",display:"flex",alignItems:"center",padding:"0 24px",height:60,gap:32}}>
        {/* Logo */}
        <svg width="36" height="36" viewBox="0 0 50 50" fill="white"><path d="M25 5 L5 20 L10 20 L10 35 L20 35 L20 22 L30 22 L30 35 L40 35 L40 20 L45 20 Z"/></svg>
        {/* Nav links */}
        <div style={{display:"flex",gap:24,flex:1,justifyContent:"center"}}>
          {["Promotion","Men","Women","Kids","Sports","Discover","Outlet"].map(l=>(
            <span key={l} style={{color:"#fff",fontSize:13,fontWeight:500,letterSpacing:.3,cursor:"default"}}>{l}</span>
          ))}
        </div>
        {/* Search */}
        <div style={{display:"flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.08)",borderRadius:4,padding:"6px 12px",width:220,cursor:"text"}} onClick={()=>{ if(!searchActive) onSearchFocus(); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            ref={inputRef}
            value={searchQuery}
            onChange={e=>setSearchQuery(e.target.value)}
            onFocus={onSearchFocus}
            onKeyDown={e=>{ if(e.key==="Enter") onSearchSubmit(); }}
            placeholder="Search UA"
            style={{background:"transparent",border:"none",outline:"none",color:"#fff",fontSize:13,flex:1,"::placeholder":{color:"#888"}}}
          />
          {searchQuery && <span onClick={()=>setSearchQuery("")} style={{color:"#888",cursor:"pointer",fontSize:14}}>✕</span>}
        </div>
        <div style={{display:"flex",gap:16}}>
          <span style={{color:"#aaa",fontSize:18,cursor:"pointer"}}>♡</span>
          <span style={{color:"#aaa",fontSize:18,cursor:"pointer"}}>🛍</span>
        </div>
      </div>
      {/* Sale strip */}
      <div style={{background:"#111",textAlign:"center",padding:"5px 0",fontSize:12,color:"#bbb",borderTop:"1px solid #222"}}>
        Early Access: Up to 50% off for Members.
      </div>
    </div>
  );
}

/* ─── SEARCH DRAWER ─────────────────────────────────────────────────────────── */
function SearchDrawer({ query, onClose, onSubmit }) {
  const topProducts=[
    {name:"UA Halo Runner",     sub:"Men's Running Shoes",   price:"£87.97",was:"£125", colors:4, img:SHOES.charged.img},
    {name:"UA Halo Runner SE",  sub:"Men's Running Shoes",   price:"£67.97",was:"£135", colors:6, img:SHOES.haloSE.img},
    {name:"UA Halo Runner",     sub:"Women's Running Shoes", price:"£87.97",was:"£125", colors:2, img:SHOES.haloRacer.img},
    {name:"UA Velociti Pace",   sub:"Women's Running Shoes. Daily Miles, Lightweight", price:"£79.97",was:"£100", colors:3, img:SHOES.pace.img},
  ];
  const suggestions=["women running shoes","trail running shoes","kids running shoes","ua velocity 3 running shoes","running shoes for men","white running shoes","surge 3 running shoes","black running shoes"];
  return (
    <>
      {/* overlay behind drawer but below nav */}
      <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.4)",zIndex:150}} onClick={onClose}/>
      {/* drawer itself — sits below nav */}
      <div style={{position:"fixed",top:112,left:0,right:0,zIndex:160,background:"#fff",boxShadow:"0 8px 32px rgba(0,0,0,0.15)",maxHeight:"calc(100vh - 112px)",overflowY:"auto"}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"24px 32px",display:"flex",gap:40}}>
          {/* Products */}
          <div style={{flex:1}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <span style={{fontWeight:600,fontSize:14,color:"#111"}}>Top Products</span>
              <span style={{fontSize:13,color:UA_RED,cursor:"pointer",fontWeight:500}}>See All Results</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
              {topProducts.map((p,i)=>(
                <div key={i} style={{cursor:"pointer"}}>
                  <div style={{background:"#f5f5f5",borderRadius:4,height:160,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:8,overflow:"hidden"}}>
                    <img src={p.img} alt={p.name} style={{height:140,objectFit:"contain"}} onError={e=>{e.target.style.display="none"}}/>
                  </div>
                  <div style={{fontSize:11,color:"#999",marginBottom:2}}>{p.colors} Colors</div>
                  <div style={{fontSize:13,fontWeight:500,color:"#111"}}>{p.name}</div>
                  <div style={{fontSize:12,color:"#666",marginBottom:4}}>{p.sub}</div>
                  <div style={{fontSize:13,color:"#111"}}>{p.price} <span style={{textDecoration:"line-through",color:"#999"}}>{p.was}</span></div>
                </div>
              ))}
            </div>
            {/* Article teaser */}
            <div style={{marginTop:24,background:"#1a1a1a",borderRadius:4,padding:"20px 24px"}}>
              <div style={{fontSize:18,fontWeight:700,color:"#fff",marginBottom:6}}>How to Choose the Best Running Shoes</div>
              <div style={{fontSize:13,color:"#aaa",lineHeight:1.6}}>So, you've committed to taking your running to the next level. Whatever your goals, you're going to need to find the best running shoes for your situation.</div>
            </div>
          </div>
          {/* Suggestions */}
          <div style={{width:220,flexShrink:0}}>
            <div style={{fontWeight:600,fontSize:14,color:"#111",marginBottom:16}}>Suggested</div>
            {suggestions.map((s,i)=>(
              <div key={i} style={{fontSize:13,color:"#333",padding:"6px 0",cursor:"pointer",borderBottom:"1px solid #f0f0f0"}}>{s}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── CLP ARTICLE ───────────────────────────────────────────────────────────── */
function CLPPage() {
  return (
    <div style={{fontFamily:"Inter,sans-serif",color:"#333"}}>
      {/* Hero */}
      <div style={{position:"relative",height:380,background:"linear-gradient(135deg,#0d1b2e 0%,#1a3a5c 60%,#2a5080 100%)",overflow:"hidden",display:"flex",alignItems:"flex-end",justifyContent:"flex-end",padding:32}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"url(https://underarmour.scene7.com/is/image/Underarmour/SS26_Q1_Velociti_Elite3_Launch_COG_ATT_CLP_Hero_1_1)",backgroundSize:"cover",backgroundPosition:"center",opacity:.65}}/>
        <div style={{position:"relative",textAlign:"right"}}>
          <div style={{color:"#fff",fontSize:48,fontWeight:900,letterSpacing:-2,lineHeight:1}}>VELOCITI</div>
          <div style={{color:"rgba(255,255,255,0.7)",fontSize:11,letterSpacing:2,marginTop:4}}>ENGINEERED BY SHARON LOKEDI</div>
        </div>
      </div>
      <div style={{maxWidth:860,margin:"0 auto",padding:"40px 24px 80px"}}>
        <div style={{fontSize:12,color:"#999",marginBottom:24}}>Discover › Blog › How to Choose the Best Running Shoes</div>
        <h1 style={{fontSize:38,fontWeight:900,marginBottom:16,lineHeight:1.1,color:"#111"}}>How to Choose the Best Running Shoes</h1>
        <p style={{fontSize:15,lineHeight:1.8,marginBottom:12}}>So, you've committed to taking your running to the next level. It could be your first 5k. You might be building towards a marathon. Or you're focused on everyday running for health and fitness. Whatever your goals, you're going to need to find the best running shoes for your situation.</p>
        <p style={{fontSize:15,lineHeight:1.8,marginBottom:12}}>There is a lot of choice out there when it comes to choosing running footwear, so how do you find the best running shoes for you? Ultimately, choosing the right pair depends on a number of factors, including:</p>
        <ul style={{fontSize:15,lineHeight:2.2,marginBottom:20,paddingLeft:24}}>
          <li>The kind of running you do</li><li>What surface you run on</li><li>Your running goals</li><li>Your experience level</li>
        </ul>
        <p style={{fontSize:15,lineHeight:1.8,marginBottom:32}}>In this guide, you'll learn more about why running shoes are important and what factors you should consider when choosing a pair. You'll also find examples of the best running shoes for different needs.</p>

        <h2 style={{fontSize:28,fontWeight:800,marginBottom:12,marginTop:40,color:"#111"}}>Why purpose-built running shoes are so important</h2>
        <p style={{fontSize:15,lineHeight:1.8,marginBottom:12}}>Head to a sports gear shop, and you'll find hundreds of kinds of shoes with different features and designs. So what makes running shoes different, and why is it important to choose purpose-built running footwear — rather than more general sport or training shoes?</p>
        <p style={{fontSize:15,lineHeight:1.8,marginBottom:12}}>Running shoes are built specifically for how your body moves when running. That sounds obvious, but this influences several key characteristics of their design:</p>
        <ul style={{fontSize:15,lineHeight:1.9,marginBottom:20,paddingLeft:24}}>
          <li style={{marginBottom:10}}><strong>Cushioning:</strong> Most running shoes place most of their cushioning in the rear. This is because your feet mainly strike the ground on the heel when running. Compare a running shoe with, say, a golf shoe — cushioning in a golf shoe is distributed more evenly across the sole, since golfers shift their weight side to side, backwards and forwards. But when you're running, you're mainly striking the ground with your heel in the same place, over and again.</li>
          <li style={{marginBottom:10}}><strong>Direction of travel:</strong> If you look at the tread on running footwear, you'll see that it follows a one-directional pattern since your feet follow the same motion throughout the running motion. Compare that to the soles of basketball shoes — they have grip going in multiple directions to help with side-to-side movements.</li>
          <li><strong>Weight:</strong> Running shoes are among the lightest kinds of footwear out there. Each shoe is designed slightly differently, but they all use extremely lightweight materials which allow you to move as easily as possible.</li>
        </ul>

        <h2 style={{fontSize:28,fontWeight:800,marginBottom:12,marginTop:40,color:"#111"}}>Factors to consider when buying running shoes</h2>
        <p style={{fontSize:15,lineHeight:1.8,marginBottom:16}}>There are plenty of different kinds of running footwear out there, all of which are designed for specific needs. To help you narrow down your search, think about the following factors when looking for your next pair.</p>

        <h3 style={{fontSize:20,fontWeight:700,marginBottom:8,marginTop:28}}>1. Running surface</h3>
        <p style={{fontSize:15,lineHeight:1.8,marginBottom:10}}>What kind of surface do you plan to run on? There are different sorts of shoes built for different kinds of surfaces. They basically fall into two categories:</p>
        <h4 style={{fontSize:16,fontWeight:700,marginBottom:6,marginTop:16}}>Road running shoes</h4>
        <p style={{fontSize:15,lineHeight:1.8,marginBottom:10}}>If you mainly run on smooth but hard surfaces like asphalt or tarmac you'll want footwear that prioritises cushioning in the heel area, and which has a very tough tread to handle the friction from the road surface. These shoes also tend to be the go-to choice for treadmill running. UA Infinite Elite for men and women: Crank it up in shoes that feel responsive from the very first stride — tons of spring, soft UA HOVR+ cushioning to keep your legs feeling fresh so you can go the distance.</p>
        <h4 style={{fontSize:16,fontWeight:700,marginBottom:6,marginTop:16}}>Trail running shoes</h4>
        <p style={{fontSize:15,lineHeight:1.8,marginBottom:16}}>Run on muddy, stony, uneven surfaces? Then a trail running shoe is ideal. They have chunky lugs on the soles, which give you extra grip. They often have cushioning along the entire sole, since you'll be running on unstable surfaces. UA Bandit Trail 3 for men and women: Specially built for trail running, with crazy cushioning, traction that grips even muddy terrain, and the extra protection trail runners need to keep going.</p>

        <h3 style={{fontSize:20,fontWeight:700,marginBottom:8,marginTop:28}}>2. Your running goals</h3>
        <ul style={{fontSize:15,lineHeight:1.9,marginBottom:20,paddingLeft:24}}>
          <li style={{marginBottom:10}}><strong>Distance:</strong> As a rule of thumb, the longer the distance you cover, the more cushioning you'll want. Someone training for a marathon will need more cushioning than someone doing 3k on a treadmill. UA Infinite Running Shoes: Built insanely light and supportive, paired with soft, springy UA HOVR+ cushioning.</li>
          <li style={{marginBottom:10}}><strong>Speed:</strong> If smashing a PB is your goal, the best carbon plate running shoes use advanced technology to help propel you forward. UA Flow Velociti: A full-length, carbon fiber plate adds propulsion, while rubberless UA Flow cushioning makes it light and grippy.</li>
          <li><strong>Competitive vs casual:</strong> The best everyday running shoes are solid all-rounders — perfect for regular, short to mid-distance runs. Competitive running shoes tend to have more specialised features for speed, cushioning or different surfaces.</li>
        </ul>

        <h3 style={{fontSize:20,fontWeight:700,marginBottom:8,marginTop:28}}>3. Your pronation</h3>
        <p style={{fontSize:15,lineHeight:1.8,marginBottom:10}}>Pronation is a technical term that describes the movement of your feet when they strike the ground. There are three kinds of pronation:</p>
        <ul style={{fontSize:15,lineHeight:1.9,marginBottom:20,paddingLeft:24}}>
          <li style={{marginBottom:10}}><strong>Neutral:</strong> In neutral pronation, the outside of the heel comes into contact with the ground first, while your toes are still pointing up. The foot then rolls in and most of the side of your foot comes into contact with the ground. You then push off with your front foot — with most of your toes pushing away.</li>
          <li style={{marginBottom:10}}><strong>Overpronation:</strong> Your foot rolls inward excessively. Most of your weight is on the inside of your foot. People who overpronate often have low arches or flat feet.</li>
          <li><strong>Underpronation (supination):</strong> Your foot doesn't roll in enough, and most of your weight is carried on the outside. You push off the ground with your smaller toes. People who supinate often have high arches.</li>
        </ul>
        <p style={{fontSize:15,lineHeight:1.8,marginBottom:20}}>The majority of people have a neutral running pattern and will be fine with neutral running shoes. But if you overpronate or underpronate, consider choosing a pair of stability running shoes — they offer extra support and cushioning in the midfoot to help reduce strain.</p>

        <h3 style={{fontSize:20,fontWeight:700,marginBottom:8,marginTop:28}}>4. The general conditions you run in</h3>
        <p style={{fontSize:15,lineHeight:1.8,marginBottom:20}}>Tend to run in hot places? You'll want super breathable shoes. Found the streets of a rainy city? You'll want something that's water resistant. Live in a cool climate? Insulated running shoes are the way to go. Running in areas with low light? Our UA Infinite Pro 2 Running Shoe features 360° reflectivity for added visibility.</p>

        <h3 style={{fontSize:20,fontWeight:700,marginBottom:8,marginTop:28}}>5. Your age</h3>
        <p style={{fontSize:15,lineHeight:1.8,marginBottom:32}}>Kids and youth runners have slightly different needs to adult runners. Since they weigh less than adults, youth shoes use lighter materials and don't need to offer the same levels of cushioning.</p>

        <h2 style={{fontSize:28,fontWeight:800,marginBottom:16,marginTop:40,color:"#111"}}>The best running shoes for different needs</h2>

        <h3 style={{fontSize:20,fontWeight:700,marginBottom:8,marginTop:28}}>Best running shoes for beginners</h3>
        <p style={{fontSize:15,lineHeight:1.8,marginBottom:16}}>Just started your running journey? UA Infinite running shoes give you lightweight, flexible and cushioned running gear. The key is the use of our unique HOVR cushioning — it absorbs the impact of every footstrike while generating energy return, helping you spring forward with every step.</p>

        <h3 style={{fontSize:20,fontWeight:700,marginBottom:8,marginTop:28}}>The best neutral running shoes</h3>
        <p style={{fontSize:15,lineHeight:1.8,marginBottom:16}}>Neutral running shoes give you more cushioning in the rearfoot, and have a flexible mid and front foot so you can flex your feet and push off with maximum ground contact. UA Sonic 7 running shoes for men and women are incredibly light and supportive, featuring our unique HOVR cushioning.</p>

        <h3 style={{fontSize:20,fontWeight:700,marginBottom:8,marginTop:28}}>The best trail running shoes</h3>
        <p style={{fontSize:15,lineHeight:1.8,marginBottom:16}}>Trail running shoes need to give you tough grip, water resistant uppers, and serious cushioning. UA Bandit Trail 3 running shoes give you everything you need to take on the toughest off-road adventures — massively durable outsoles, a super responsive Charged Cushioning® midsole and a breathable mesh upper.</p>

        <h3 style={{fontSize:20,fontWeight:700,marginBottom:8,marginTop:28}}>The best running shoes for speed</h3>
        <p style={{fontSize:15,lineHeight:1.8,marginBottom:16}}>Looking to smash your PB? Our best carbon plate running shoes for speed include the New York marathon-winning UA Flow Velociti Elite. A full-length, carbon fiber plate for incredible propulsion, combined with our rubberless UA Flow cushioning and outsole system.</p>

        <h3 style={{fontSize:20,fontWeight:700,marginBottom:8,marginTop:28}}>The best marathon running shoes</h3>
        <p style={{fontSize:15,lineHeight:1.8,marginBottom:16}}>Grinding for 26.2 miles is incredibly tough. Men's and women's UA Infinite Elite Marathon Shoes offer incredible, lightweight support mile after mile — ultra springy UA HOVR cushioning, super breathable uppers, and a heel collar for added comfort and lockdown.</p>

        <h2 style={{fontSize:28,fontWeight:800,marginBottom:12,marginTop:40,color:"#111"}}>Under Armour: building some of the world's best running shoes</h2>
        <p style={{fontSize:15,lineHeight:1.8,marginBottom:12}}>At Under Armour, we're continually innovating to build the world's best running shoes — from innovative carbon plate technology to UA HOVR™ cushioning that is more durable than traditional foams, everything about our running shoes is made to give you an edge.</p>
        <p style={{fontSize:15,lineHeight:1.8,marginBottom:0}}>Discover some of the best running shoes for men, women and kids. Or for help narrowing down your search, use our shoe finder tool.</p>
        <div style={{textAlign:"center",marginTop:40,paddingTop:24,borderTop:"1px solid #eee",fontSize:12,color:"#999"}}>Back to full blog</div>
      </div>
    </div>
  );
}

/* ─── SHOE IMAGE with fallback ──────────────────────────────────────────────── */
function ShoeImage({ shoe, height=210, imgHeight=190 }) {
  const [failed, setFailed] = useState(false);
  // Try alternate URL patterns on error
  const urls = [shoe.img].filter(Boolean);
  const [urlIdx, setUrlIdx] = useState(0);

  if (failed || !shoe.img) {
    return (
      <div style={{background:"#f0f0f0",height,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6}}>
        <div style={{fontSize:32}}>👟</div>
        <div style={{fontSize:11,color:"#999",textAlign:"center",padding:"0 8px"}}>{shoe.name}</div>
      </div>
    );
  }
  return (
    <div style={{background:"#f7f7f7",height,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <img
        src={urlIdx < urls.length ? urls[urlIdx] : urls[0]}
        alt={shoe.name}
        style={{maxHeight:imgHeight,maxWidth:"100%",objectFit:"contain"}}
        onError={()=>{ if(urlIdx < urls.length-1) setUrlIdx(i=>i+1); else setFailed(true); }}
      />
    </div>
  );
}

/* ─── PRODUCT CARD (grid) ───────────────────────────────────────────────────── */
function ProductCard({ shoe, compareSelected, onCompareToggle }) {
  return (
    <div style={{background:"#fff",border:"1px solid #eee",borderRadius:2,overflow:"hidden",position:"relative",transition:"box-shadow .2s"}}>
      <div style={{position:"absolute",top:10,right:10,zIndex:1,cursor:"pointer",fontSize:18,color:"#bbb"}}>♡</div>
      <ShoeImage shoe={shoe} height={210} imgHeight={190}/>
      <div style={{padding:"8px 12px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <button onClick={()=>onCompareToggle(shoe)} style={{background:compareSelected?"#333":UA_BLACK,color:"#fff",border:"none",borderRadius:20,padding:"6px 16px",fontSize:12,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
          {compareSelected?"✓ Compare":"Compare"}
        </button>
        <div style={{background:UA_BLACK,borderRadius:"50%",width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff",fontSize:14}}>🛍</div>
      </div>
      <div style={{padding:"0 12px 6px",display:"flex",gap:4,flexWrap:"wrap"}}>
        {shoe.colors.map((c,i)=><div key={i} style={{width:16,height:16,borderRadius:"50%",background:c,border:"1px solid #ddd"}}/>)}
      </div>
      <div style={{padding:"4px 12px 14px"}}>
        <div style={{fontWeight:600,fontSize:13,marginBottom:2}}>{shoe.name}</div>
        <div style={{fontSize:12,color:"#777",marginBottom:6}}>{shoe.sub}</div>
        <div style={{fontWeight:700,fontSize:14,marginBottom:4}}>{shoe.price}</div>
        <div style={{fontSize:11,color:UA_GREEN,fontWeight:500}}>SALE FOR MEMBERS ONLY. LOG IN BEFORE SHOPPING.</div>
      </div>
    </div>
  );
}

/* ─── ZOE CHAT ──────────────────────────────────────────────────────────────── */
function ZoeChat({ messages, onChip, onSuggestedQ, onSuggestedAction, onFollowUp, inputVal, setInputVal, onSend }) {
  const bottomRef = useRef(null);
  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[messages]);

  const pillBtn = (label, onClick) => (
    <button
      key={label}
      onClick={onClick}
      style={{
        background:"#fff",
        border:"1.5px solid #d0d0d0",
        color:"#111",
        borderRadius:999,
        padding:"7px 14px",
        fontSize:12,
        cursor:"pointer",
        whiteSpace:"nowrap",
        fontFamily:"Inter,sans-serif",
        fontWeight:400,
        lineHeight:1.3,
        transition:"border-color .15s, background .15s",
      }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor=UA_RED; e.currentTarget.style.color=UA_RED; }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor="#d0d0d0"; e.currentTarget.style.color="#111"; }}
    >{label}</button>
  );

  return (
    <div style={{width:260,minWidth:260,background:"#fff",display:"flex",flexDirection:"column",height:"100%",borderRight:"1px solid #e8e8e8",fontFamily:"Inter,sans-serif",boxShadow:"2px 0 12px rgba(0,0,0,0.06)"}}>
      {/* Header */}
      <div style={{padding:"16px 18px 14px",borderBottom:"1px solid #f0f0f0",display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:36,height:36,borderRadius:"50%",background:UA_RED,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:"#fff",fontSize:15,flexShrink:0,letterSpacing:-0.5}}>Z</div>
        <div>
          <div style={{color:"#111",fontWeight:700,fontSize:14,lineHeight:1}}>Zoe</div>
          <div style={{color:"#888",fontSize:11,marginTop:3}}>UA Running Advisor</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{flex:1,overflowY:"auto",padding:"16px 14px",display:"flex",flexDirection:"column",gap:10}}>
        {messages.map((msg,i)=>(
          <div key={i}>
            {msg.from==="zoe"
              ? <div style={{background:"#f2f2f2",color:"#111",borderRadius:"6px 18px 18px 6px",padding:"10px 14px",fontSize:13,lineHeight:1.65,whiteSpace:"pre-wrap",maxWidth:"95%"}}>{msg.text}</div>
              : <div style={{display:"flex",justifyContent:"flex-end"}}>
                  <div style={{background:"#111",color:"#fff",borderRadius:"18px 6px 6px 18px",padding:"10px 14px",fontSize:13,maxWidth:"88%",lineHeight:1.55}}>{msg.text}</div>
                </div>
            }

            {/* Chips — horizontal wrapping pills */}
            {msg.chips && i===messages.length-1 && (
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:6}}>
                {msg.chips.map(c=>pillBtn(c,()=>onChip(c)))}
              </div>
            )}

            {/* Suggested Qs — horizontal wrapping pills */}
            {msg.suggestedQs && i===messages.length-1 && (
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:6}}>
                {msg.suggestedQs.map(q=>pillBtn(q,()=>onSuggestedQ(q)))}
              </div>
            )}

            {/* Follow-up */}
            {msg.followUp && i===messages.length-1 && (
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:6}}>
                {pillBtn(msg.followUp,()=>onFollowUp(msg.followUp))}
              </div>
            )}

            {/* Suggested action */}
            {msg.suggestedAction && i===messages.length-1 && (
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:6}}>
                {pillBtn(msg.suggestedAction,()=>onSuggestedAction(msg.suggestedAction))}
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef}/>
      </div>

      {/* Input */}
      <div style={{borderTop:"1px solid #f0f0f0",padding:"12px 14px",display:"flex",gap:10,alignItems:"center"}}>
        <input
          value={inputVal}
          onChange={e=>setInputVal(e.target.value)}
          onKeyDown={e=>{ if(e.key==="Enter") onSend(); }}
          placeholder="Type a question — e.g. 'Is this right for my marathon?'"
          style={{flex:1,background:"#f5f5f5",border:"1.5px solid #e8e8e8",color:"#111",borderRadius:999,padding:"9px 16px",fontSize:12,outline:"none",fontFamily:"Inter,sans-serif"}}
        />
        <button onClick={onSend} style={{background:UA_RED,border:"none",borderRadius:"50%",width:36,height:36,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 2px 8px rgba(200,16,46,0.3)"}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>
  );
}

/* ─── PLP HEADER ─────────────────────────────────────────────────────────────── */
function PLPHeader({ count, filterTags, onRemoveTag }) {
  return (
    <div style={{padding:"20px 24px 0",fontFamily:"Inter,sans-serif"}}>
      <h1 style={{fontSize:22,fontWeight:700,marginBottom:14,color:"#111"}}>Products ({count})</h1>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:10}}>
        {["Sort by","Size","Color","Price"].map(f=>(
          <button key={f} style={{border:"1px solid #ccc",background:"#fff",padding:"6px 14px",borderRadius:4,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:4,color:"#333"}}>
            {f} <span style={{fontSize:10}}>▾</span>
          </button>
        ))}
      </div>
      {filterTags.length>0 && (
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
          {filterTags.map((tag,i)=>(
            <div key={i} style={{border:"1px solid #ccc",borderRadius:4,padding:"4px 10px",fontSize:12,display:"flex",alignItems:"center",gap:6,color:"#333",background:"#fff"}}>
              {tag}<span onClick={()=>onRemoveTag(tag)} style={{cursor:"pointer",color:"#999",fontWeight:700,fontSize:14,lineHeight:1}}>×</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── COMPARISON MODAL ─────────────────────────────────────────────────────── */
function CompareModal({ onConfirm, onClose }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"#fff",borderRadius:8,padding:28,width:520,maxWidth:"92vw",boxShadow:"0 24px 64px rgba(0,0,0,0.25)",fontFamily:"Inter,sans-serif"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <span style={{fontWeight:700,fontSize:18,color:"#111"}}>Compare</span>
          <span onClick={onClose} style={{cursor:"pointer",fontSize:22,color:"#aaa",lineHeight:1}}>×</span>
        </div>
        <div style={{display:"flex",gap:16,marginBottom:24}}>
          {[SHOES.lokedi,SHOES.distance].map(s=>(
            <div key={s.id} style={{flex:1,border:"1px solid #eee",borderRadius:8,padding:14}}>
              <ShoeImage shoe={s} height={120} imgHeight={108}/>
              <div style={{fontWeight:600,fontSize:13,marginBottom:2,color:"#111"}}>{s.name}</div>
              <div style={{fontSize:11,color:"#777",marginBottom:8}}>{s.sub}</div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>
                {s.tags.map((t,i)=><span key={i} style={{background:UA_RED,color:"#fff",fontSize:10,fontWeight:600,padding:"2px 7px",borderRadius:3}}>{t}</span>)}
              </div>
              <div style={{fontWeight:700,fontSize:14,color:"#111"}}>{s.price}</div>
            </div>
          ))}
        </div>
        <button onClick={onConfirm} style={{width:"100%",background:UA_BLACK,color:"#fff",border:"none",padding:"14px 0",borderRadius:4,fontWeight:700,fontSize:15,cursor:"pointer",letterSpacing:.3}}>
          Compare
        </button>
      </div>
    </div>
  );
}

/* ─── COMPARISON TABLE ───────────────────────────────────────────────────────── */
function CompareTable() {
  const rows=[["Price","£225","£145"],["Best for","Race day only","Long training runs"],["Cushioning","HOVR+ carbon plate","HOVR+ full-length"],["Weight","221g","298g"],["Heel offset","2mm","6mm"],["Weekly use","Race days only","3–5/week"],["Sizing","Half size up","True to size"]];
  return (
    <div style={{flex:1,overflowY:"auto",fontFamily:"Inter,sans-serif"}}>
      <div style={{padding:"28px 32px 0"}}>
        <div style={{display:"grid",gridTemplateColumns:"180px 1fr 1fr"}}>
          <div/>
          {[SHOES.lokedi,SHOES.distance].map(s=>(
            <div key={s.id} style={{padding:"0 20px 20px",display:"flex",gap:14,alignItems:"flex-start"}}>
              <div onClick={()=>{ if(s.id==="lokedi") window.open("https://und3rarmour-zoe-pdp.vercel.app/#","_blank"); }} style={{cursor:s.id==="lokedi"?"pointer":"default",flexShrink:0}}>
                <ShoeImage shoe={s} height={100} imgHeight={90}/>
              </div>
              <div>
                <div onClick={()=>{ if(s.id==="lokedi") window.open("https://und3rarmour-zoe-pdp.vercel.app/#","_blank"); }} style={{fontWeight:700,fontSize:14,marginBottom:3,color:s.id==="lokedi"?"#185FA5":"#111",cursor:s.id==="lokedi"?"pointer":"default",lineHeight:1.3}}>{s.name}</div>
                <div style={{fontSize:12,color:"#777",marginBottom:6}}>{s.sub}</div>
                <div style={{fontWeight:700,fontSize:15,color:"#111"}}>{s.price}</div>
              </div>
            </div>
          ))}
        </div>
        {rows.map(([lbl,a,b],i)=>(
          <div key={i} style={{display:"grid",gridTemplateColumns:"180px 1fr 1fr",borderTop:"1px solid #eee"}}>
            <div style={{padding:"13px 0",fontWeight:600,fontSize:13,color:"#333"}}>{lbl}</div>
            <div style={{padding:"13px 20px",fontSize:13,color:"#555"}}>{a}</div>
            <div style={{padding:"13px 20px",fontSize:13,color:"#555"}}>{b}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── FOOTER ─────────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <div style={{background:"#fff",borderTop:"1px solid #eee",padding:"36px 24px",marginTop:32,fontFamily:"Inter,sans-serif"}}>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:28,marginBottom:28}}>
        <div>
          <div style={{fontWeight:700,marginBottom:10,fontSize:14}}>Stay in the loop.</div>
          <div style={{display:"flex",gap:8,marginBottom:8}}>
            <input placeholder="Email Address" style={{flex:1,border:"1px solid #ccc",padding:"8px 12px",fontSize:13,outline:"none"}}/>
            <button style={{background:UA_BLACK,color:"#fff",border:"none",padding:"8px 16px",fontWeight:600,cursor:"pointer",fontSize:13}}>Submit</button>
          </div>
          <div style={{fontSize:11,color:"#999",marginBottom:12}}>By providing your email, you agree to the Terms & Conditions and Privacy Policy. You may unsubscribe later.</div>
          <div style={{fontSize:12,fontWeight:600,marginBottom:6}}>Accepted Payment Methods</div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
            {["VISA","MC","PayPal","AMEX","Apple Pay","Klarna"].map(p=><span key={p} style={{border:"1px solid #ccc",borderRadius:3,padding:"2px 7px",fontSize:11}}>{p}</span>)}
          </div>
        </div>
        {[["Need Help?",["Help & FAQ","Size Guide","Shipping & Delivery","Returns","Store Locator","Order Tracking","Sitemap","Accessibility Statement","Accessibility Settings"]],["About Under Armour",["UA Blog","Affiliates","About UA","Sustainability","Careers","Student Discount","UK Tax Strategy","UK Modern Slavery Act"]],["UA Social",["📷 Instagram","👍 Facebook","✕ X","▶ Youtube"]]].map(([title,items])=>(
          <div key={title}><div style={{fontWeight:700,marginBottom:10,fontSize:13}}>{title}</div>{items.map(l=><div key={l} style={{fontSize:12,color:"#555",marginBottom:5}}>{l}</div>)}</div>
        ))}
      </div>
      <div style={{borderTop:"1px solid #eee",paddingTop:14,fontSize:11,color:"#999"}}>© 2026 Under Armour®, Inc. / Privacy Policy / Terms & Conditions / 3.9.1</div>
    </div>
  );
}

/* ─── MAIN APP ───────────────────────────────────────────────────────────────── */
export default function App() {
  const [page, setPage]                   = useState("clp");
  const [searchActive, setSearchActive]   = useState(false);
  const [searchQuery, setSearchQuery]     = useState("");
  const [messages, setMessages]           = useState([{ from:"zoe", text:STEPS[0].text, chips:STEPS[0].chips }]);
  const [scriptStep, setScriptStep]       = useState(0);
  const [filterTags, setFilterTags]       = useState([]);
  const [productCount, setProductCount]   = useState(64);
  const [currentGrid, setCurrentGrid]     = useState(GRID_ALL);
  const [compareList, setCompareList]     = useState([]);
  const [gridKey, setGridKey]             = useState(0);
  const [gridVisible, setGridVisible]     = useState(true);
  const [showModal, setShowModal]         = useState(false);
  const [chatInput, setChatInput]         = useState("");

  const pushZoe = (obj) => setMessages(p=>[...p,{from:"zoe",...obj}]);
  const pushUser = (text) => setMessages(p=>[...p,{from:"user",text}]);

  /* apply grid state from a script step */
  const applyGridState = (step) => {
    if(!step.gridState) return;
    // Fade out, swap grid, fade in
    setGridVisible(false);
    setTimeout(() => {
      if(step.gridState==="road")     { setFilterTags(["Categories: Road"]); setProductCount(24); setCurrentGrid(GRID_ROAD); }
      if(step.gridState==="marathon") { setFilterTags(["Categories: Road","Categories: Long distance"]); setProductCount(10); setCurrentGrid(GRID_MARATHON); }
      if(step.gridState==="final")    { setFilterTags(["Categories: Shoes","Categories: Road","Categories: Long distance"]); setProductCount(5); setCurrentGrid(GRID_FINAL); }
      setGridKey(k => k+1);
      setGridVisible(true);
    }, 220);
  };

  /* chip click — advances through scripted pairs */
  const handleChip = (text) => {
    // Find user step that matches this text
    const userStep = STEPS.find(s=>s.from==="user" && s.text===text && s.id > scriptStep);
    if(!userStep) return;
    const zoeStep  = STEPS.find(s=>s.from==="zoe" && s.id===userStep.id+1);
    if(!zoeStep) return;

    pushUser(text);
    // Apply grid immediately when user answers
    applyGridState(userStep);
    setScriptStep(zoeStep.id);
    setTimeout(()=>pushZoe({ text:zoeStep.text, chips:zoeStep.chips, suggestedQs:zoeStep.suggestedQs, followUp:zoeStep.followUp, suggestedAction:zoeStep.suggestedAction }), 450);
  };

  /* suggested Q tap */
  const handleSuggestedQ = (q) => {
    pushUser(q);
    if(q==="What is UA HOVR?") {
      setTimeout(()=>{ const s=STEPS[10]; pushZoe({text:s.text,followUp:s.followUp}); setScriptStep(10); },450);
    } else {
      // post-comparison suggested Qs — contextual answers
      const answers = {
        "How does the extra heel cushioning protect your hips and knees?": "The extra foam in the heel of the Distance creates a deeper cushioning pocket at the point of highest impact. When you've been running for 25–35km, the compressive force on your hips and knees is significantly higher than at km 5. The extra heel stack absorbs more of that energy before it travels up the kinetic chain — reducing the micro-stress that causes soreness and injury over a long training block.",
        "Does the 6mm drop suit runners from maximalist shoes?": "A 6mm drop is considered moderate — it sits between the high drop of most everyday trainers (8–12mm) and the very low drop of minimalist shoes. If you're coming from a maximalist shoe (10mm+), the Distance is a reasonable step down. Just introduce it gradually — 20–30% of your weekly volume at first — to allow your calves and achilles to adapt over 3–4 weeks.",
        "Can I use the Distance for both easy and long runs?": "Yes — the Velociti Distance is designed to be a versatile daily trainer. Its HOVR+ foam handles both easy recovery miles and long runs equally well. Where it won't serve you is pure speed work or track sessions — for those, a lighter shoe like the Velociti SPD makes more sense. But for 80–90% of your marathon training volume, the Distance can carry the load."
      };
      setTimeout(()=>pushZoe({text:answers[q]||"Great question! The Distance is optimised for exactly that use case — the full-length HOVR+ foam stack means it performs consistently whether you're doing an easy 8km or a 32km long run."}),450);
    }
  };

  /* follow-up / suggested action */
  const handleSuggestedAction = (text) => {
    pushUser(text);
    if(text==="Are there any alternatives?") {
      const s=STEPS[12]; setTimeout(()=>{ pushZoe({text:s.text,suggestedAction:s.suggestedAction}); setScriptStep(12); },450);
    } else if(text==="Can you compare all of them?") {
      const s=STEPS[14]; setTimeout(()=>{ pushZoe({text:s.text,suggestedQs:s.suggestedQs}); setScriptStep(14); setTimeout(()=>setShowModal(true),600); },450);
    }
  };

  /* freeform input */
  const handleSend = () => {
    const txt=chatInput.trim(); if(!txt) return; setChatInput("");
    pushUser(txt);
    if(isRainQ(txt)) { setTimeout(()=>pushZoe({text:RAIN_ANSWER}),500); return; }
    setTimeout(()=>pushZoe({text:"Thanks for your question! For the most detailed answer I'd recommend checking the product page directly. Is there anything else I can help you with regarding these shoes?"}),450);
  };

  /* compare toggle */
  const handleCompareToggle = (shoe) => {
    setCompareList(prev=>{
      if(prev.find(s=>s.id===shoe.id)) return prev.filter(s=>s.id!==shoe.id);
      if(prev.length>=2) return prev;
      const next=[...prev,shoe];
      if(next.length===2) setTimeout(()=>setShowModal(true),200);
      return next;
    });
  };

  /* search submit */
  const handleSearchSubmit = () => {
    if(searchQuery.toLowerCase().includes("running")||searchQuery.trim().length>0) {
      setSearchActive(false); setPage("plp");
    }
  };

  return (
    <div style={{fontFamily:"Inter,sans-serif",background:"#fff",minHeight:"100vh"}}>
      <Nav
        onSearchFocus={()=>setSearchActive(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        searchActive={searchActive}
      />

      {searchActive && <SearchDrawer query={searchQuery} onClose={()=>setSearchActive(false)} onSubmit={handleSearchSubmit}/>}

      {page==="clp" && <CLPPage/>}

      {(page==="plp"||page==="comparison") && (
        <div style={{display:"flex",height:"calc(100vh - 113px)"}}>
          <ZoeChat
            messages={messages}
            onChip={handleChip}
            onSuggestedQ={handleSuggestedQ}
            onSuggestedAction={handleSuggestedAction}
            onFollowUp={handleSuggestedAction}
            inputVal={chatInput}
            setInputVal={setChatInput}
            onSend={handleSend}
          />
          {page==="plp" && (
            <div style={{flex:1,overflowY:"auto"}}>
              <PLPHeader count={productCount} filterTags={filterTags} onRemoveTag={t=>setFilterTags(p=>p.filter(x=>x!==t))}/>
              <div key={gridKey} style={{padding:"12px 24px 40px",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,transition:"opacity 0.22s ease",opacity:gridVisible?1:0}}>
                {currentGrid.map(shoe=>(
                  <ProductCard key={shoe.id} shoe={shoe} compareSelected={!!compareList.find(s=>s.id===shoe.id)} onCompareToggle={handleCompareToggle}/>
                ))}
              </div>
              <Footer/>
            </div>
          )}
          {page==="comparison" && <CompareTable/>}
        </div>
      )}

      {showModal && (
        <CompareModal
          onConfirm={()=>{ setShowModal(false); setPage("comparison"); }}
          onClose={()=>setShowModal(false)}
        />
      )}
    </div>
  );
}
