import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Target } from 'lucide-react';

const PredictionChartSection = () => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (d3Container.current) {
      const data = [
        { month: 'M1', without: 20, with: 35 },
        { month: 'M2', without: 35, with: 60 },
        { month: 'M3', without: 45, with: 85 },
        { month: 'M4', without: 50, with: 95 },
        { month: 'M5', without: 52, with: 98 },
      ];

      const margin = { top: 20, right: 30, bottom: 30, left: 40 };
      const width = 800 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      d3.select(d3Container.current).selectAll('*').remove();

      const svg = d3.select(d3Container.current)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3.scalePoint()
        .domain(data.map(d => d.month))
        .range([0, width])
        .padding(0.5);

      const y = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0]);

      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).tickSize(0).tickPadding(15))
        .style('font-size', '12px')
        .style('font-family', 'var(--font-sans)')
        .style('color', 'rgba(255,255,255,0.4)')
        .select('.domain').remove();

      svg.append('g')
        .call(d3.axisLeft(y).ticks(5).tickSize(0).tickPadding(15))
        .style('font-size', '12px')
        .style('font-family', 'var(--font-sans)')
        .style('color', 'rgba(255,255,255,0.4)')
        .select('.domain').remove();

      // Grid lines
      svg.selectAll("line.horizontalGrid").data(y.ticks(5)).enter()
        .append("line")
        .attr("class", "horizontalGrid")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", d => y(d))
        .attr("y2", d => y(d))
        .style("stroke", "rgba(255,255,255,0.05)");

      // Lines
      const lineWithout = d3.line<any>().x(d => x(d.month)!).y(d => y(d.without)).curve(d3.curveMonotoneX);
      const lineWith = d3.line<any>().x(d => x(d.month)!).y(d => y(d.with)).curve(d3.curveMonotoneX);

      // Defs for gradients
      const defs = svg.append("defs");
      const gradWith = defs.append("linearGradient").attr("id", "gradWith").attr("x1", "0%").attr("x2", "100%");
      gradWith.append("stop").attr("offset", "0%").style("stop-color", "#00E5FF");
      gradWith.append("stop").attr("offset", "100%").style("stop-color", "#8B5CF6");

      svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'rgba(255,255,255,0.2)')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5')
        .attr('d', lineWithout);

      const pathWith = svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'url(#gradWith)')
        .attr('stroke-width', 4)
        .attr('d', lineWith);

      // Animation
      const totalLength = (pathWith.node() as SVGPathElement).getTotalLength();
      pathWith
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

      // Dots
      svg.selectAll('.dot-with')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => x(d.month)!)
        .attr('cy', d => y(d.with))
        .attr('r', 0)
        .attr('fill', '#0A0F1E')
        .attr('stroke', '#00E5FF')
        .attr('stroke-width', 3)
        .transition()
        .delay((_, i) => (2000 / data.length) * i)
        .duration(500)
        .attr('r', 6);
    }
  }, []);

  return (
    <section className="relative py-40 border-t border-[#00E5FF]/8 overflow-hidden bg-[#0A0F1E]">
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">
         
         <div className="text-center mb-16 space-y-6">
            <p className="text-[#FF00AA] font-black uppercase tracking-[0.4em] text-sm">Predictive Modeling</p>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter">Certification <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF00AA] to-[#8B5CF6]">Success Prediction.</span></h2>
            <p className="text-white/55 text-xl font-medium leading-relaxed max-w-2xl mx-auto">
              Our neural network accurately forecasts pass rates weeks before exam day, virtually eliminating wasted voucher spend.
            </p>
         </div>

         <div className="w-full max-w-4xl os-glass p-8 md:p-12 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden flex flex-col items-center">
            <div className="absolute top-8 left-8 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6]" />
                <span className="text-xs font-black uppercase tracking-widest text-white/80">With CertForge AI</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border-2 border-white/20 border-dashed" />
                <span className="text-xs font-black uppercase tracking-widest text-white/50">Traditional LMS</span>
              </div>
            </div>
            
            <div className="mt-16 w-full overflow-x-auto no-scrollbar flex justify-center">
              <div ref={d3Container} className="min-w-[700px]" />
            </div>

            <div className="absolute right-12 bottom-12 os-glass bg-[#0A0F1E]/80 px-6 py-4 rounded-2xl border border-[#00E5FF]/30 flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-[#00E5FF]/20 flex items-center justify-center">
                 <Target className="w-5 h-5 text-[#00E5FF]" />
               </div>
               <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-[#00E5FF]">Predicted Delta</p>
                 <p className="text-2xl font-black text-white">+46% Pass Rate</p>
               </div>
            </div>
         </div>
      </div>
    </section>
  );
};

export default PredictionChartSection;
