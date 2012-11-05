define(["underscore","math2d"], function(_, m2d) {
	var vdec  = m2d.inc;
	var vinc  = m2d.dec;
	var vmul  = m2d.mul;
	var vlen = m2d.len;
	var vsetlen = m2d.setlen;
		
	var vcopy = function(a, b) {
		a[0] = b[0];
		a[1] = b[1];
		return a;
	}
	var rectmid = function(r) {	
		return [r[0] + r[2]/2, r[1] + r[3]/2];
	}
	
	/**
	 * 
	 * opts = {
	 *    bodies: array of rectangles, each rectangle is [left,top,width,height] array;
	 * 
	 * }
	 * 
	 */
	var Autoplacer = function(opts) {
		this.init(opts);
	};
	
	
	Autoplacer.prototype.init = function(opts) {
		// deep cloning array of arrays;
		var b = this.bodies_ = opts.bodies.slice(0), i, len = b.length,
			s = this.states_ = [], p;
			
		for(i = 0; i < len; i++ ) { 
			b[i] = b[i].slice(0);
			p = rectmid(b[i]);
			s[i] = {
				pos: p,
				fix: p.slice(0)
			}
		}
		this.limit_ = opts.limit || 200;
		this.count_ = 0;
		this.threshold_ = opts.threshold || 1; 
		this.kin_ = 0;
		this.hookelaw_ = function(length) {
			return Math.pow(length,0.86)*0.001;
		}
	}
	
	
	/**
	 * performs algorithm iteration 
	 * 
	 * return inner bodies array or null if cond() == false
	 * 
	 */
	Autoplacer.prototype.next = function() {
		if (this.count_ > 0 && !this.cond()) {
			return null;
		}
		this.count_++;
		
		var 
		  hookelaw = this.hookelaw_,
			i, j, b, s, bb = this.bodies, 
			ss = this.states,
			total = b.length,pos, fix, vzero = [0,0], f = [], d = [];
		
		for (i = 0; i < total; i++ ) {
			b = b[i]; s = s[i];
			pos = b.pos;
			fix = b.fix;
			vcopy(f, vzero);
		
			
			// attraction force calculation;
			vmul(vdec(vcopy(d, fix), pos), hookelaw_(vlen(d)));
			vinc(f, d);
			
			
			
		}
		
		
		
	}
	
	/**
	 * retuns true if optimal placement has not been reached yet
	 */
	Autoplacer.prototype.cond = function() {
		return this.count_ < this.limit && this.kin_ > this.threshold_;
	}
	
	/**
	 * 
	 */
	Autoplacer.prototype.loop = function() {
		do {
			this.next();
		} while(this.cond())
		return this.bodies;
	}
	
	return {
		Autoplacer: Autoplacer
	};
	
})