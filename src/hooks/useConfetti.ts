export function useConfetti() {
	function triggerConfetti() {
		try {
			const durationMs = 900;
			const end = Date.now() + durationMs;
			const colors = ['#ffffffff', '#ffffffff', '#ffffffff', '#ffffffff', '#ffffffff'];
			const count = 120;
			const createParticle = () => {
				const div = document.createElement('div');
				div.textContent = '•';
				div.style.position = 'fixed';
				div.style.zIndex = '9999';
				div.style.left = Math.random() * 100 + 'vw';
				div.style.top = '-2vh';
				div.style.fontSize = Math.floor(Math.random() * 14 + 8) + 'px';
				div.style.color = colors[Math.floor(Math.random() * colors.length)];
				div.style.pointerEvents = 'none';
				document.body.appendChild(div);
				const start = Date.now();
				const xDrift = (Math.random() - 0.5) * 2; // -1..1
				const rotate = Math.random() * 360;
				const anim = () => {
					const elapsed = Date.now() - start;
					const progress = elapsed / durationMs;
					div.style.transform = `translate(${xDrift * 100 * progress}vw, ${progress * 110}vh) rotate(${rotate + progress * 360}deg)`;
					if (elapsed < durationMs) requestAnimationFrame(anim);
					else div.remove();
				};
				requestAnimationFrame(anim);
			};
			for (let i = 0; i < count; i++) setTimeout(createParticle, Math.random() * 200);
			const interval = setInterval(() => {
				if (Date.now() > end) return clearInterval(interval);
				for (let i = 0; i < 10; i++) createParticle();
			}, 120);
		} catch {}
	}
	return { triggerConfetti };
}
