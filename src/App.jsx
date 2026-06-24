import { useState, useRef, useEffect, Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{padding:40,fontFamily:"monospace",color:"red"}}>
          <strong>Error: </strong>{this.state.error.toString()}
        </div>
      );
    }
    return this.props.children;
  }
}

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
  distance: { id:"distance", name:"UA Velociti Distance",                   sub:"Men's Running Shoes. Long Runs, Cushioned",             price:"£145", tags:["Road","HOVR+foam","298g","Long distance"],     colors:["#1565c0","#f5c518","#4caf50","#222","#555"],               img:"/images/distance.png" },
  pace:     { id:"pace",     name:"UA Velociti Pace",                       sub:"Men's Running Shoes. Daily Miles, Lightweight",         price:"£100", tags:["HOVR+foam","Lightweight"],                     colors:["#e53935","#f5c518","#4fc3f7","#ff8a65","#9e9e9e","#222","#78909c"], img:"/images/pace.png" },
  charged:  { id:"charged",  name:"UA Charged+ Turbulence 3",               sub:"Men's Running Shoes",                                  price:"£85",  tags:["Charged","Daily trainer"],                    colors:["#fff","#222","#e53935"],                   img:"/images/charged.png" },
  haloRacer:{ id:"haloRacer",name:"UA Halo Racer",                          sub:"Men's Running Shoes",                                  price:"£155", tags:["Neutral","Road"],                              colors:["#ff8a65","#fff","#9e9e9e"],                img:"/images/halo_racer.png" },
  haloSE:   { id:"haloSE",   name:"UA Halo Runner SE",                      sub:"Men's Running Shoes",                                  price:"£135", tags:["Cushioned","Road"],                            colors:["#9e9e9e","#78909c","#fff","#555"],         img:"/images/halo_runner_se.png" },
  spd:      { id:"spd",      name:"UA Velociti SPD",                        sub:"Men's Running Shoes. Tempo & Track, Lightweight",      price:"£120", tags:["Lightweight","Speed"],                        colors:["#4fc3f7","#e53935","#f5c518","#4caf50","#222"], img:"/images/spd.png" },
  rogue:    { id:"rogue",    name:"UA Charged+ Rogue 6",                    sub:"Men's Running Shoes",                                  price:"£75",  tags:["Charged","Road"],                              colors:["#e53935","#fff","#78909c","#ff8a65"],      img:"/images/rogue.png" },
  explor:   { id:"explor",   name:"UA EXPLOR Trail",                        sub:"Unisex Shoes",                                         price:"£135", tags:["Trail","Grip"],                                colors:["#4caf50","#222","#78909c"],                img:"/images/explor.png" },
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

/* ─── QUESTION DETECTION ────────────────────────────────────────────────────── */
function isHeelOffsetQ(t){
  const s=t.toLowerCase();
  return s.includes("heel offset")||s.includes("heel drop")||s.includes("drop")||s.includes("offset")||s.includes("heel height");
}
function isPriceKeywordQ(t){
  const s=t.toLowerCase();
  return s.includes("price")||s.includes("expensive")||s.includes("cost")||s.includes("worth")||s.includes("cheaper")||s.includes("pay")||s.includes("pricey")||s.includes("difference")&&(s.includes("£")||s.includes("money"));
}

/* ─── RAIN DETECTION ────────────────────────────────────────────────────────── */
function isRainQ(t){
  const s=t.toLowerCase();
  return s.includes("rain")||s.includes("wet")||s.includes("water")||s.includes("damp")||s.includes("weather")||s.includes("drizzle")||s.includes("downpour")||s.includes("rainy")||s.includes("moisture");
}
const HEEL_OFFSET_ANSWER = `Heel offset (or heel drop) is the height difference between your heel and forefoot in the shoe.

The Lokedi PE has a 2mm drop — almost flat. This encourages a midfoot or forefoot strike, which transfers energy more directly into the carbon plate for maximum propulsion. It also means less cushioning under the heel, so it rewards efficient running form.

The Distance has a 6mm drop — moderate and more forgiving. It works well for heel strikers and runners who haven't adapted to low-drop shoes. The extra heel height also helps protect your achilles and calves over high mileage.

If you're used to standard trainers (8–12mm drop), jumping straight into the Lokedi PE's 2mm could strain your achilles. Easing in gradually — or using the Distance for training — is the smarter approach.`;

const RAIN_ANSWER=`Neither shoe is built exclusively for wet weather, but they handle it differently.

UA Velociti Distance: The breathable mesh upper absorbs water in heavy rain, adding a little weight mid-run. The rubber outsole provides solid grip on wet tarmac for training runs — most road runners find it perfectly usable in light to moderate rain.

UA Velociti Elite 3 'Lokedi' PE: The Leno weave upper is more resistant to water absorption than standard mesh, keeping the shoe lighter for longer in wet conditions. The outsole was specifically micro-tuned for traction at top speed, including on wet roads — UA designed it to hold speed even when the road surface is slick.

For race-day conditions that might turn wet, the Lokedi PE has the edge. For everyday wet-weather training, the Distance is more than adequate — just expect it to feel a touch heavier after a downpour.`;

/* ─── PRICE QUESTION DETECTION ───────────────────────────────────────────────── */
function isPriceQ(t){
  const s=t.toLowerCase();
  return (s.includes("expensive")||s.includes("price")||s.includes("cost")||s.includes("worth")||s.includes("cheap")||s.includes("why")&&s.includes("more")||s.includes("difference")&&(s.includes("price")||s.includes("cost")||s.includes("£"))||s.includes("justify")||s.includes("pay")||s.includes("pricey"))
    && (s.includes("lokedi")||s.includes("elite")||s.includes("sharon")||s.includes("expensive")||s.includes("more")||s.includes("225")||s.includes("cost"));
}
const LOKEDI_PRICE_ANSWER = `The Velociti Elite 3 'Sharon Lokedi' PE is a full race-day system built around a full-length carbon fibre plate — the same technology that powers world-record marathon performances.

The carbon plate acts as a spring in the midsole. On landing it stores energy, and at toe-off it releases it explosively, propelling you forward with significantly less muscular effort. Research shows this improves running economy by 4–8% per stride — over 42km, that's the difference between fading at mile 20 and finishing strong.

Everything in the shoe is engineered to work with that plate:
• HOVR+ superfoam — UA's lightest, most responsive cushioning, tuned to complement the plate's snap
• Leno weave upper — specialist construction that locks your foot in place at race pace while weighing almost nothing
• 221g — among the lightest marathon shoes on the market
• 2mm heel drop — positions your foot to transfer energy directly into the plate's flex point

It was co-developed with Sharon Lokedi, who wore it to win the Boston Marathon 2025 and set a course record. It's a precision race instrument — every gram and every layer of it is there for a reason.`;

const PRICE_ANSWER_SHORT = `The £80 gap comes down to the carbon fibre plate in the Lokedi PE. That plate acts like a spring — it stores energy on landing and releases it explosively at toe-off, propelling you forward with less effort. It's the same technology that helped Sharon Lokedi win Boston 2025. The Distance uses pure HOVR+ foam — excellent for training, but without that mechanical propulsion boost. Put simply: the Lokedi PE is a race-day weapon, the Distance is your training workhorse.`;

const PRICE_CITATIONS = [
  { abbr:"UA", label:"Under Armour — Velociti Elite 3 Story", url:"https://about.underarmour.com/en/stories/2025/10/under-armour-s-next-generation-of-velociti-is-engineered-for-spe.html", color:"#c8102e" },
  { abbr:"VE", label:"UA Velociti Elite 3 Product Page", url:"https://www.underarmour.co.uk/en-gb/p/ua-velociti-elite-3-sharon-lokedi-pe-unisex-running-shoes/6005377.html", color:"#1a1a1a" },
];

const PRICE_ANSWER=`The £80 price gap comes down to one thing above everything else: the full-length carbon fibre plate.

Here's why that matters:

Carbon fibre plate — the key technology
A carbon plate is embedded into the midsole and acts like a spring-loaded launchpad. When your foot compresses the foam on landing, the plate stores that energy and releases it explosively at toe-off — propelling you forward with less muscular effort. In practice, studies on carbon plate shoes show energy savings of 4–8% per stride. Over a marathon that adds up to a significant reduction in fatigue, which is why elite runners like Sharon Lokedi rely on them to set course records.

The plate in the Lokedi PE isn't off-the-shelf — it's micro-tuned for geometry and flex point, developed alongside professional marathon runners to maximise propulsion at race pace specifically.

What else justifies the price:
• HOVR+ supercritical foam — a lighter, more responsive version of standard HOVR, engineered to maintain energy return over the full 42km
• Leno weave upper — a specialist material that provides race-day lockdown at a fraction of the weight of standard mesh
• 221g total weight — 77g lighter than the Distance, which matters enormously at mile 20
• Race-proven pedigree — the exact colourway Sharon Lokedi wore to win Boston 2025

Is it worth it for you?
If you're training for a marathon and racing it too, the ideal setup is the Distance for your training block and the Lokedi PE for race day itself. That way you're not burning through a £225 shoe on daily mileage, but you still get the performance edge when it counts.`;

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
  const faqs = [
    "What are the best running shoes for hill repeats?",
    "What are the best running shoes for long-distance comfort?",
    "What are the best running shoes with stability support?",
    "What features improve long-distance running comfort?",
    "How can I balance cushioning and responsiveness for speed?",
    "What's new in the latest Velociti Collection?",
  ];

  return (
    <div style={{fontFamily:"Inter,sans-serif",color:"#333"}}>

      {/* ── HERO ── */}
      <div style={{width:"100%",height:440,overflow:"hidden",position:"relative"}}>
        <img src="/images/hero.jpeg" alt="Velociti Collection" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 30%",display:"block"}}/>
      </div>

      {/* ── PAGE BODY ── */}
      <div style={{maxWidth:860,margin:"0 auto",padding:"40px 24px 80px"}}>

        {/* Sale strip */}
        <div style={{background:"#f5f5f5",textAlign:"center",padding:"10px 0",fontSize:13,fontWeight:500,marginBottom:32,borderRadius:2}}>
          SALE: Up to 50% Off. <span style={{color:UA_RED,fontWeight:700,cursor:"pointer",textDecoration:"underline"}}>SHOP NOW</span>
        </div>

        {/* Collection header */}
        <div style={{textAlign:"center",marginBottom:48}}>
          <div style={{fontSize:12,fontWeight:600,letterSpacing:2,textTransform:"uppercase",color:"#888",marginBottom:8}}>Velociti Collection</div>
          <h1 style={{fontSize:36,fontWeight:900,letterSpacing:-1,lineHeight:1.1,marginBottom:16,textTransform:"uppercase",color:"#111"}}>A Complete Race-Day System</h1>
          <p style={{fontSize:15,lineHeight:1.8,color:"#444",marginBottom:8,maxWidth:620,margin:"0 auto 12px"}}>Lightweight tops that reduce friction. Breathable, stretchy shorts that move with you. Running shoes engineered for performance. From short sprints to long distances, Velociti is built head to toe to perform when it counts.</p>
          <p style={{fontSize:14,fontWeight:600,letterSpacing:.5}}>Race-Day starts here.</p>
        </div>

        {/* Looks for Race Day */}
        <div style={{borderTop:"2px solid #111",paddingTop:20,marginBottom:40}}>
          <h2 style={{fontSize:18,fontWeight:800,letterSpacing:1,textTransform:"uppercase",marginBottom:20}}>Looks for Race Day</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:16}}>
            {[0,1,2].map(i=>(
              <div key={i} style={{background:"#1a1a1a",height:280,overflow:"hidden",borderRadius:2}}>
                <img src="/images/hero.jpeg" alt="Race day look" style={{width:"100%",height:"100%",objectFit:"cover",opacity:.8}}/>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,fontSize:12,color:"#444"}}>
            <div><div style={{fontWeight:600,marginBottom:2}}>Velociti Elite Singlet</div><div>Velociti Elite Shorts</div><div style={{fontWeight:600,marginTop:6}}>Velociti Elite 3 Shoes</div></div>
            <div><div style={{fontWeight:600,marginBottom:2}}>Velociti Short Sleeve</div><div>HeatGear® Mesh Shorts</div><div style={{fontWeight:600,marginTop:6}}>Velociti Distance Shoes</div></div>
            <div><div style={{fontWeight:600,marginBottom:2}}>Velociti Short Sleeve</div><div>Vanish Elite Shorts</div><div style={{fontWeight:600,marginTop:6}}>Velociti Distance Shoes</div></div>
          </div>
        </div>

        {/* Built for Speed */}
        <div style={{borderTop:"2px solid #111",paddingTop:20,marginBottom:40,background:"#f9f9f9",padding:"20px 24px",borderRadius:2}}>
          <h2 style={{fontSize:18,fontWeight:800,letterSpacing:1,textTransform:"uppercase",marginBottom:20}}>Built for Speed</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
            {[
              {img:"/images/lokedi.png", tag:"For Race Day",       name:"Velociti Elite 3", desc:"Maximum propulsion and turnover. Pinnacle race day experience."},
              {img:SHOES.spd.img,        tag:"For Race Day Prep",  name:"Velociti Pro 2",   desc:"Speed, durability, and stability for miles. Training partner to the elite."},
              {img:SHOES.pace.img,       tag:"For Uninhibited Speed", name:"Velociti SPD",  desc:"Natural, soft underfoot feel."},
            ].map((s,i)=>(
              <div key={i} style={{textAlign:"center"}}>
                <div style={{background:"#fff",borderRadius:4,height:180,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10,padding:12}}>
                  <img src={s.img} alt={s.name} style={{maxHeight:160,maxWidth:"100%",objectFit:"contain"}} onError={e=>{e.target.style.display="none"}}/>
                </div>
                <div style={{fontSize:10,fontWeight:600,letterSpacing:1.5,textTransform:"uppercase",color:"#888",marginBottom:3}}>{s.tag}</div>
                <div style={{fontSize:15,fontWeight:800,marginBottom:4}}>{s.name}</div>
                <p style={{fontSize:12,color:"#555",lineHeight:1.6,marginBottom:8}}>{s.desc}</p>
                <span style={{fontSize:12,fontWeight:600,textDecoration:"underline",cursor:"pointer"}}>Shop Now</span>
              </div>
            ))}
          </div>
        </div>

        {/* Built for Distance */}
        <div style={{borderTop:"2px solid #111",paddingTop:20,marginBottom:40}}>
          <h2 style={{fontSize:18,fontWeight:800,letterSpacing:1,textTransform:"uppercase",marginBottom:20}}>Built for Distance</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:24}}>
            {[
              {img:SHOES.distance.img, tag:"For Long Runs",       name:"Velociti Distance", desc:"Soft and snappy HOVR+™ superfoam balances responsiveness and stability to make quick work of every mile."},
              {img:SHOES.pace.img,     tag:"For Everyday Distance", name:"Velociti Pace",   desc:"The ultimate shoe for speeding up your daily miles, with snappy HOVR™ foam for energy return and a light, stable fit."},
            ].map((s,i)=>(
              <div key={i}>
                <div style={{background:"#f5f5f5",borderRadius:4,height:220,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12,padding:16}}>
                  <img src={s.img} alt={s.name} style={{maxHeight:200,maxWidth:"100%",objectFit:"contain"}} onError={e=>{e.target.style.display="none"}}/>
                </div>
                <div style={{fontSize:10,fontWeight:600,letterSpacing:1.5,textTransform:"uppercase",color:"#888",marginBottom:3}}>{s.tag}</div>
                <div style={{fontSize:18,fontWeight:800,marginBottom:8}}>{s.name}</div>
                <p style={{fontSize:13,color:"#555",lineHeight:1.7,marginBottom:10}}>{s.desc}</p>
                <div style={{display:"flex",gap:12}}>
                  <span style={{fontSize:12,fontWeight:600,textDecoration:"underline",cursor:"pointer"}}>Shop Women</span>
                  <span style={{fontSize:12,fontWeight:600,textDecoration:"underline",cursor:"pointer"}}>Shop Men</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Find your shoe + FAQs */}
        <div style={{borderTop:"2px solid #111",paddingTop:32,textAlign:"center"}}>
          <h2 style={{fontSize:22,fontWeight:800,textTransform:"uppercase",letterSpacing:.5,marginBottom:12}}>Find the Best Running Shoe for You</h2>
          <button style={{background:UA_BLACK,color:"#fff",border:"none",padding:"12px 32px",fontSize:13,fontWeight:600,borderRadius:2,cursor:"pointer",marginBottom:40,letterSpacing:.5}}>Take the Quiz</button>
          <div style={{textAlign:"left"}}>
            {faqs.map((q,i)=>(
              <div key={i} style={{padding:"14px 0",borderBottom:"1px solid #eee",fontSize:14,color:"#333",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                {q}<span style={{color:"#bbb",fontSize:18}}>›</span>
              </div>
            ))}
            <div style={{textAlign:"center",marginTop:20}}>
              <span style={{fontSize:13,fontWeight:600,textDecoration:"underline",cursor:"pointer"}}>View All FAQs</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─── SHOE IMAGE with fallback ──────────────────────────────────────────────── */
function ShoeImage({ shoe, height, imgHeight }) {
  const [failed, setFailed] = useState(false);
  const urls = [shoe.img].filter(Boolean);
  const [urlIdx, setUrlIdx] = useState(0);

  // Used in comparison table with explicit height
  const containerStyle = {background:"#fff",height:height||"100%",display:"flex",alignItems:"center",justifyContent:"center"};
  const imgStyle = {maxWidth:"100%",maxHeight:"100%",objectFit:"contain",padding:12,boxSizing:"border-box"};
  const fallbackStyle = {background:"#f5f5f5",height:height||"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6};

  if (failed || !shoe.img) {
    return (
      <div style={fallbackStyle}>
        <div style={{fontSize:36}}>👟</div>
        <div style={{fontSize:11,color:"#999",textAlign:"center",padding:"0 8px"}}>{shoe.name}</div>
      </div>
    );
  }
  return (
    <div style={containerStyle}>
      <img
        src={urlIdx < urls.length ? urls[urlIdx] : urls[0]}
        alt={shoe.name}
        style={imgStyle}
        onError={()=>{ if(urlIdx < urls.length-1) setUrlIdx(i=>i+1); else setFailed(true); }}
      />
    </div>
  );
}


/* ─── PRODUCT CARD (grid) ───────────────────────────────────────────────────── */
function ProductCard({ shoe, compareSelected, onCompareToggle }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={()=>setHovered(true)}
      onMouseLeave={()=>setHovered(false)}
      style={{position:"relative",cursor:"pointer",background:"#fff"}}
    >
      {/* Image */}
      <div style={{position:"relative",width:"100%",aspectRatio:"354/443",background:"#f0f0f0",overflow:"hidden"}}>
        <img
          src={shoe.img}
          alt={shoe.name}
          style={{width:"100%",height:"100%",objectFit:"contain",display:"block",padding:"30px",boxSizing:"border-box"}}
          onError={e=>{e.target.style.display="none"}}
        />
        {/* Wishlist */}
        <div style={{position:"absolute",top:10,right:10,color:"#555",fontSize:18,lineHeight:1}}>♡</div>
        {/* Compare button — bottom right of image */}
        <div style={{position:"absolute",bottom:10,right:10}}>
          <button
            onClick={(e)=>{ e.stopPropagation(); onCompareToggle(shoe); }}
            style={{background:UA_BLACK,color:"#fff",border:"none",borderRadius:100,padding:"7px 18px",fontSize:12,fontWeight:600,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:5,opacity:compareSelected?1:0.85}}
          >
            {compareSelected && <span style={{fontSize:10}}>✓</span>}Compare
          </button>
        </div>
      </div>

      {/* Color swatches — square chips like UA */}
      <div style={{padding:"8px 0 4px",display:"flex",gap:4,alignItems:"center"}}>
        {shoe.colors.map((c,i)=>(
          <div key={i} style={{width:20,height:20,borderRadius:4,background:c,border:"1px solid #e0e0e0",flexShrink:0}}/>
        ))}
        <span style={{fontSize:12,color:"#555",marginLeft:4}}>{shoe.colors.length} Colors</span>
      </div>

      {/* Name + sub */}
      <div style={{paddingBottom:4}}>
        <div style={{fontSize:14,fontWeight:600,color:"#111",lineHeight:1.3}}>{shoe.name}</div>
        <div style={{fontSize:12,color:"#777",marginTop:2,lineHeight:1.4}}>{shoe.sub}</div>
      </div>

      {/* Price */}
      <div style={{fontSize:14,fontWeight:700,color:"#111",margin:"4px 0 10px"}}>{shoe.price}</div>

      {/* Sale tag */}
      <div style={{fontSize:11,color:"#2e7d32",fontWeight:500}}>SALE FOR MEMBERS ONLY. LOG IN BEFORE SHOPPING.</div>
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
    <div style={{width:"100%",background:"#fff",display:"flex",flexDirection:"column",height:"100%",borderRight:"1px solid #e8e8e8",fontFamily:"Inter,sans-serif",boxShadow:"2px 0 12px rgba(0,0,0,0.06)"}}>
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
              ? <div>
                  <div style={{background:"#f2f2f2",color:"#111",borderRadius:"6px 18px 18px 6px",padding:"10px 14px",fontSize:13,lineHeight:1.65,whiteSpace:"pre-wrap",maxWidth:"95%"}}>
                    {msg.text}
                    {msg.streaming && <span style={{display:"inline-block",width:2,height:"1em",background:"#555",marginLeft:2,verticalAlign:"text-bottom",animation:"blink 0.7s step-end infinite"}}>
                      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
                    </span>}
                  </div>
                  {msg.citations && <CitationBar sources={msg.citations}/>}
                </div>
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
function PLPHeader({ count, filterTags, onRemoveTag, onOpenChat }) {
  return (
    <div style={{padding:"20px 24px 0",fontFamily:"Inter,sans-serif"}}>
      <div style={{fontSize:12,color:"#777",marginBottom:8}}>Sports / Running</div>
      <h1 style={{fontSize:28,fontWeight:800,marginBottom:14,color:"#111",letterSpacing:-.5}}>Running Shoes</h1>
      <div style={{fontSize:13,color:"#777",marginBottom:14}}>{count} Items</div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:10}}>
        {["Sort by","Size","Color","Price"].map(f=>(
          <button key={f} style={{border:"1px solid #ccc",background:"#fff",padding:"6px 14px",borderRadius:4,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:4,color:"#333"}}>
            {f} <span style={{fontSize:10}}>▾</span>
          </button>
        ))}
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:10}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {filterTags.map((tag,i)=>(
            <div key={i} style={{border:"1px solid #ccc",borderRadius:4,padding:"4px 10px",fontSize:12,display:"flex",alignItems:"center",gap:6,color:"#333",background:"#fff"}}>
              {tag}<span onClick={()=>onRemoveTag(tag)} style={{cursor:"pointer",color:"#999",fontWeight:700,fontSize:14,lineHeight:1}}>×</span>
            </div>
          ))}
        </div>
        <button onClick={onOpenChat} style={{background:UA_BLACK,color:"#fff",border:"none",borderRadius:999,padding:"10px 20px",fontSize:13,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",gap:8,whiteSpace:"nowrap"}}>
          <span style={{fontSize:14}}>✦</span> Let our AI find the right shoes for you
        </button>
      </div>
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
            <div key={s.id} style={{flex:1}}>
              <ProductCard shoe={s} compareSelected={false} onCompareToggle={()=>{}}/>
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
function CompareTable({ onRowClick }) {
  const ROW_RESPONSES = {
    "Price":      { userQ: "Why is there such a big price difference?", text: `The £80 gap comes down to the carbon fibre plate in the Lokedi PE. That plate acts like a spring — it stores energy on landing and releases it explosively at toe-off, propelling you forward with less effort. The Distance uses pure HOVR+ foam — excellent for training, but without that mechanical propulsion boost.`, qs: ["Can I use the Lokedi PE for training too?", "Is the carbon plate worth it for a first marathon?", "Which one offers better value for money?"] },
    "Best for":   { userQ: "What is each shoe best for?", text: `The Lokedi PE is engineered exclusively for race day — its carbon plate and low 2mm drop are optimised for speed at peak effort, not daily mileage. The Distance is your training workhorse, built to absorb the cumulative load of 3–5 sessions a week across a full marathon prep block.`, qs: ["What pace does the Lokedi PE suit best?", "Can the Distance handle race day too?", "What if I only want to buy one shoe?"] },
    "Cushioning": { userQ: "Can you tell me more about the cushioning?", text: `Both use HOVR+ foam, but differently. In the Distance, full-length HOVR+ prioritises comfort and protection over long miles — it's softer and more forgiving. In the Lokedi PE, the HOVR+ works in combination with the carbon fibre plate: the foam absorbs impact while the plate stores and releases energy, creating a propulsive snap that pure foam can't replicate.`, qs: ["What is UA HOVR?", "How does the carbon plate affect cushioning feel?", "Will the Lokedi PE feel harsh underfoot?"] },
    "Weight":     { userQ: "How significant is the weight difference?", text: `The 77g difference matters more than it sounds. Over a marathon, that's roughly 3,200 extra grams lifted per foot with every stride. The Lokedi PE's Leno weave upper and minimal construction keep it race-light. The Distance carries more foam and a heavier mesh upper — worth it for training comfort, but not what you want on race day.`, qs: ["Does shoe weight really affect finish time?", "How does the Leno weave upper feel?", "Is the Distance too heavy for a half marathon?"] },
    "Heel offset":{ userQ: "What does the heel offset difference mean?", text: `Heel offset is the height difference between your heel and forefoot. The Lokedi PE's 2mm drop encourages a midfoot strike that transfers energy directly into the carbon plate. The Distance's 6mm drop is more forgiving for heel strikers and protects your achilles over high mileage. If you're used to standard trainers (8–12mm), the Lokedi PE's 2mm requires gradual adaptation.`, qs: ["How long does it take to adapt to a lower drop?", "I'm a heel striker — which shoe suits me?", "Can a low drop shoe cause injury?"] },
    "Weekly use": { userQ: "How often can I use each shoe per week?", text: `The carbon plate in the Lokedi PE isn't designed for repeated daily loading — using it for every run would wear it out faster and offer no training benefit over the Distance. Most elite runners keep their race shoe for race day and key workouts only. The Distance handles 3–5 sessions a week comfortably across a full training block.`, qs: ["How many km does the Lokedi PE last?", "Can I rotate both shoes in my training?", "What shoe should I use for tempo runs?"] },
    "Sizing":     { userQ: "How does the sizing work for both shoes?", text: `The Lokedi PE runs small due to its snug Leno weave upper and race-fit construction — go half a size up. The Distance runs true to size, though if you're between sizes and doing long runs, a half size up gives your toes room when feet swell after 25km.`, qs: ["How do I measure my foot for the right size?", "Do feet swell significantly over a marathon?", "What if I'm between sizes for the Distance?"] },
  };
  const rows=[["Price","£225","£145"],["Best for","Race day only","Long training runs"],["Cushioning","HOVR+ carbon plate","HOVR+ full-length"],["Weight","221g","298g"],["Heel offset","2mm","6mm"],["Weekly use","Race days only","3–5/week"],["Sizing","Half size up","True to size"]];
  return (
    <div style={{flex:1,overflowY:"auto",fontFamily:"Inter,sans-serif"}}>
      <div style={{padding:"28px 8px 0"}}>
        <div style={{display:"grid",gridTemplateColumns:"180px 1fr 1fr",alignItems:"start"}}>
          <div/>
          {[SHOES.lokedi,SHOES.distance].map(s=>(
            <div key={s.id} style={{cursor:s.id==="lokedi"?"pointer":"default",padding:"0 8px 16px"}} onClick={()=>{ if(s.id==="lokedi") window.open("https://und3rarmour-zoe-pdp.vercel.app/#","_blank"); }}>
              <ProductCard shoe={s} compareSelected={false} onCompareToggle={()=>{}}/>
            </div>
          ))}
        </div>
        {rows.map(([lbl,a,b],i)=>(
          <div key={i} style={{display:"grid",gridTemplateColumns:"180px 1fr 1fr",borderTop:"1px solid #eee"}}>
            <div
              onClick={()=>onRowClick && ROW_RESPONSES[lbl] && onRowClick(ROW_RESPONSES[lbl])}
              style={{padding:"13px 0",fontWeight:600,fontSize:13,color:"#333",cursor:"pointer",display:"flex",alignItems:"center",gap:6,userSelect:"none"}}
              onMouseEnter={e=>e.currentTarget.style.color=UA_RED}
              onMouseLeave={e=>e.currentTarget.style.color="#333"}
            >
              {lbl}
              <span style={{fontSize:10,color:"#bbb"}}>›</span>
            </div>
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
export function AppInner() {
  const [page, setPage]                   = useState("clp");
  const [searchActive, setSearchActive]   = useState(false);
  const [searchQuery, setSearchQuery]     = useState("");
  const [messages, setMessages]           = useState([]);
  const [scriptStep, setScriptStep]       = useState(0);
  const [filterTags, setFilterTags]       = useState([]);
  const [productCount, setProductCount]   = useState(64);
  const [currentGrid, setCurrentGrid]     = useState(GRID_ALL);
  const [compareList, setCompareList]     = useState([]);
  const [gridKey, setGridKey]             = useState(0);
  const [gridVisible, setGridVisible]     = useState(true);
  const [showModal, setShowModal]         = useState(false);
  const [chatInput, setChatInput]         = useState("");
  const [chatOpen, setChatOpen]           = useState(false);
  const streamRef = useRef(null);

  const pushUser = (text) => setMessages(p=>[...p,{from:"user",text}]);

  // Stream initial message on mount and whenever page resets to clp->plp
  const streamInitial = (obj) => {
    if (streamRef.current) clearInterval(streamRef.current);
    const fullText = obj.text || "";
    setMessages([{from:"zoe", ...obj, text:"", streaming:true}]);
    let i = 0;
    streamRef.current = setInterval(() => {
      i += 2;
      setMessages(p => {
        const msgs = [...p];
        const last = msgs[msgs.length - 1];
        if (!last || last.from !== "zoe") { clearInterval(streamRef.current); return msgs; }
        const done = i >= fullText.length;
        msgs[msgs.length - 1] = {
          ...last,
          text: fullText.slice(0, i),
          streaming: !done,
          chips: done ? obj.chips : undefined,
        };
        if (done) clearInterval(streamRef.current);
        return msgs;
      });
    }, 30);
  };

  useEffect(() => {
    if (chatOpen && page === "plp") {
      streamInitial({ text: STEPS[0].text, chips: STEPS[0].chips });
    }
  }, [chatOpen]);

  const pushZoe = (obj) => {
    if (streamRef.current) clearInterval(streamRef.current);
    const fullText = obj.text || "";
    // Add message with empty text first, then stream chars in
    setMessages(p => [...p, {from:"zoe", ...obj, text:"", streaming:true}]);
    let i = 0;
    const chunkSize = 2; // chars per tick
    const interval = setInterval(() => {
      i += chunkSize;
      setMessages(p => {
        const msgs = [...p];
        const last = msgs[msgs.length - 1];
        if (!last || last.from !== "zoe") { clearInterval(interval); return msgs; }
        const done = i >= fullText.length;
        msgs[msgs.length - 1] = {
          ...last,
          text: fullText.slice(0, i),
          streaming: !done,
          // only show chips/suggestedQs/etc once streaming is done
          chips: done ? obj.chips : undefined,
          suggestedQs: done ? obj.suggestedQs : undefined,
          followUp: done ? obj.followUp : undefined,
          suggestedAction: done ? obj.suggestedAction : undefined,
          citations: done ? obj.citations : undefined,
        };
        if (done) clearInterval(interval);
        return msgs;
      });
    }, 30);
    streamRef.current = interval;
  };

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
    if(q==="What is UA HOVR?" && page==="comparison") {
      setTimeout(()=>pushZoe({text:`HOVR is UA's signature cushioning technology — the foundation of their entire performance footwear range.

It works in two stages: on landing, the foam compresses under your bodyweight, absorbing the impact force through your heel and midfoot. Rather than simply deadening that energy, HOVR then springs back, returning it as forward momentum at push-off. Runners consistently describe it as feeling "springy but controlled" — it absorbs the hard stuff and gives back the good stuff.

HOVR+ is the upgraded version used in both shoes here. It's lighter and softer than standard HOVR, engineered specifically for distance running where your legs need to feel fresh at kilometre 35, not just kilometre 5.

In the Velociti Distance, full-length HOVR+ runs the entire length of the shoe to maximise cushioning across long training miles. In the Lokedi PE, HOVR+ works in combination with the carbon fibre plate — the foam handles impact absorption while the plate provides the propulsive snap that pure foam alone can't deliver.`, citations:PRICE_CITATIONS, suggestedQs:["How does HOVR+ differ from standard HOVR?","Which shoe has more HOVR+ foam?","Does cushioning affect speed?"]}),450);
    } else if(q==="What is UA HOVR?") {
      setTimeout(()=>{ const s=STEPS[10]; pushZoe({text:s.text,followUp:s.followUp}); setScriptStep(10); },450);
    } else if(isPriceQ(q)) {
      setTimeout(()=>pushZoe({text:PRICE_ANSWER, citations:PRICE_CITATIONS}),450);
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
    try {
    const txt=chatInput.trim(); if(!txt) return; setChatInput("");
    pushUser(txt);
    if(isHeelOffsetQ(txt))  { setTimeout(()=>pushZoe({text:HEEL_OFFSET_ANSWER, suggestedQs:["How long does it take to adapt to a lower drop?","I'm a heel striker — which shoe suits me?","Can a low drop shoe cause injury?"]}),500); return; }
    if(isRainQ(txt))        { setTimeout(()=>pushZoe({text:RAIN_ANSWER, suggestedQs:["Does the Lokedi PE have any water-resistant coating?","Will wet conditions affect the carbon plate?","Which shoe dries faster after a wet run?"]}),500); return; }
    if(isPriceKeywordQ(txt)||isPriceQ(txt)) {
      if(page==="comparison") {
        setTimeout(()=>pushZoe({text:PRICE_ANSWER_SHORT, citations:PRICE_CITATIONS, suggestedQs:["Is the carbon plate worth it for a first marathon?","Can I use the Lokedi PE for training runs too?","Which one offers better value for money?"]}),500);
      } else {
        setTimeout(()=>pushZoe({text:LOKEDI_PRICE_ANSWER, citations:PRICE_CITATIONS, suggestedQs:["What makes HOVR+ different from standard HOVR?","Is the carbon plate legal in all races?","How many km will the Lokedi PE last?"]}),500);
      }
      return;
    }
    setTimeout(()=>pushZoe({text:"Thanks for your question! For the most detailed answer I'd recommend checking the product page directly. Is there anything else I can help you with regarding these shoes?"}),450);
    } catch(e) { console.error('handleSend error:', e); }
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
      setSearchActive(false);
      setChatOpen(false); setPage("plp");
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
        <div style={{display:"grid",gridTemplateColumns:"360px 1fr",height:"calc(100vh - 113px)",overflow:"hidden"}}>

          {/* chat */}
          <div style={{borderRight:"1px solid #e8e8e8",overflow:"hidden",background:"#fff"}}>
            {chatOpen && (
              <div style={{animation:"slideIn 0.3s ease forwards",height:"100%"}}>
                <style>{`@keyframes slideIn { from { opacity:0; transform:translateX(-16px); } to { opacity:1; transform:translateX(0); } }`}</style>
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
              </div>
            )}
          </div>

          {/* content */}
          <div style={{overflowY:"auto",height:"100%"}}>
            {page==="plp" && (
              <>
                <PLPHeader count={productCount} filterTags={filterTags} onRemoveTag={t=>setFilterTags(p=>p.filter(x=>x!==t))} onOpenChat={()=>setChatOpen(true)}/>
                <div key={gridKey} style={{padding:"16px 24px 60px",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24,transition:"opacity 0.22s ease",opacity:gridVisible?1:0}}>
                  {currentGrid.map(shoe=>(
                    <ProductCard key={shoe.id} shoe={shoe} compareSelected={!!compareList.find(s=>s.id===shoe.id)} onCompareToggle={handleCompareToggle}/>
                  ))}
                </div>
                <Footer/>
              </>
            )}
            {page==="comparison" && <CompareTable onRowClick={(obj)=>{ if(obj){ pushUser(obj.userQ); setTimeout(()=>pushZoe({text:obj.text, suggestedQs:obj.qs}),400); } }}/>}
          </div>


        </div>
      )}

      {showModal && (
        <CompareModal
          onConfirm={()=>{
            setShowModal(false);
            setPage("comparison");
            streamInitial({ text:"Here's the full comparison between UA Velociti Elite 3 'Sharon Lokedi' PE and UA Velociti Distance! Feel free to ask me anything — price, carbon plate, heel offset, or which one suits you best." });
          }}
          onClose={()=>setShowModal(false)}
        />
      )}
    </div>
  );
}

export default function App() { return <ErrorBoundary><AppInner/></ErrorBoundary>; }
