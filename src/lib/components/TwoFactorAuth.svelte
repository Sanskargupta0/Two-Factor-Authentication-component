<script>
	import { onMount } from 'svelte';

	// Component state
	let otpInputs = [];
	let otpContainers = [];
	let otpInputGroup;
	let currentCode = '';
	let correctCode = '123456'; // Demo code - in real app this would come from server
	let currentState = 'default'; // default, success, error
	let isLoading = false;
	let buttonText = '6 digits left';
	let statusText = 'Enter 6-digit code from your two factor authenticator APP';
	let isButtonDisabled = true;

	// Reactive statements
	$: digitsEntered = currentCode.length;
	$: digitsLeft = 6 - digitsEntered;
	$: isCodeComplete = currentCode.length === 6 && /^\d{6}$/.test(currentCode);

	// Update button state reactively
	$: {
		if (isLoading) {
			buttonText = '';
			isButtonDisabled = true;
		} else if (currentState === 'success') {
			buttonText = "Let's go!";
			isButtonDisabled = false;
		} else if (currentState === 'error') {
			buttonText = 'Wrong code!';
			isButtonDisabled = false;
		} else if (digitsLeft > 0) {
			isButtonDisabled = true;
			buttonText = digitsLeft === 1 ? '1 digit left' : `${digitsLeft} digits left`;
		} else {
			isButtonDisabled = false;
			buttonText = 'Verify the code';
		}
	}

	onMount(() => {
		// Focus first input on load
		if (otpInputs[0]) {
			otpInputs[0].focus();
		}

		// Add global paste event listener
		const handleGlobalPaste = (event) => {
			// Check if any of our inputs are focused
			const focusedElement = document.activeElement;
			const isOurInput = otpInputs.some(input => input === focusedElement);
			
			if (isOurInput) {
				const focusedIndex = otpInputs.findIndex(input => input === focusedElement);
				handlePaste(event, focusedIndex);
			}
		};

		document.addEventListener('paste', handleGlobalPaste);

		// Cleanup function
		return () => {
			document.removeEventListener('paste', handleGlobalPaste);
		};
	});

	function handleInput(event, index) {
		const input = event.target;
		const value = input.value;

		// Only allow digits
		if (!/^\d$/.test(value)) {
			input.value = '';
			return;
		}

		// Animate the digit drop
		animateDigitDrop(index, value);

		// Clear the actual input (we use digit-display to show the digit)
		input.value = '';

		// Update current code
		updateCurrentCode();

		// Move to next input if current is filled
		if (value && index < otpInputs.length - 1) {
			otpInputs[index + 1].focus();
		}

		// Auto-submit if all inputs are filled
		if (isCodeComplete) {
			setTimeout(() => handleSubmit(), 500);
		}
	}

	function handleKeydown(event, index) {
		const input = event.target;
		const container = otpContainers[index];
		const digitDisplay = container?.querySelector('.digit-display');

		// Handle backspace
		if (event.key === 'Backspace') {
			if (!digitDisplay?.textContent && index > 0) {
				// Move to previous input if current is empty
				clearDigit(index - 1);
				otpInputs[index - 1].focus();
				// Ensure cursor shows on the previous input
				showCursor(index - 1);
			} else {
				// Clear current input
				clearDigit(index);
				// Show cursor on current input after clearing
				showCursor(index);
			}
			updateCurrentCode();
		}

		// Handle arrow keys
		if (event.key === 'ArrowLeft' && index > 0) {
			otpInputs[index - 1].focus();
			showCursor(index - 1);
		}
		if (event.key === 'ArrowRight' && index < otpInputs.length - 1) {
			otpInputs[index + 1].focus();
			showCursor(index + 1);
		}

		// Handle Enter key
		if (event.key === 'Enter' && isCodeComplete) {
			handleSubmit();
		}

		// Handle Ctrl+V paste
		if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
			// Let the paste event handle it, don't prevent default here
			return;
		}

		// Prevent non-digit characters (except backspace, arrow keys, etc.)
		if (!/[\d]/.test(event.key) && !['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(event.key)) {
			event.preventDefault();
		}
	}

	function handlePaste(event, index) {
		console.log('Paste event triggered:', event.type, 'at index:', index);
		event.preventDefault();
		
		const pastedData = event.clipboardData.getData('text').replace(/\D/g, ''); // Remove non-digits
		console.log('Pasted data:', pastedData);

		if (pastedData.length > 0) {
			// Clear all existing digits first
			otpContainers.forEach((container, i) => {
				clearDigit(i);
			});

			// Fill inputs with pasted data starting from the first input
			for (let i = 0; i < Math.min(pastedData.length, otpInputs.length); i++) {
				setTimeout(() => {
					animateDigitDrop(i, pastedData[i]);
				}, i * 100); // Stagger the animations
			}

			// Update current code after all digits are filled
			setTimeout(() => {
				updateCurrentCode();

				// Focus on the next empty input or the last input
				const nextIndex = Math.min(pastedData.length, otpInputs.length - 1);
				if (otpInputs[nextIndex]) {
					otpInputs[nextIndex].focus();
					showCursor(nextIndex);
				}

				// Auto-submit if all inputs are filled
				if (pastedData.length >= 6) {
					setTimeout(() => handleSubmit(), 500);
				}
			}, pastedData.length * 100 + 200);
		}
	}

	function showCursor(index) {
		const container = otpContainers[index];
		const digitDisplay = container?.querySelector('.digit-display');
		const cursor = container?.querySelector('.input-cursor');

		if (container) {
			// Always add focused class for blue border
			container.classList.add('focused');
			
			// Only show cursor animation if the input is empty
			if (!digitDisplay?.textContent && cursor) {
				// Reset cursor position and visibility
				cursor.style.opacity = '0';
				cursor.style.top = '90%';
				cursor.style.transform = 'translate(-50%, -50%)';
				
				// Force reflow
				void cursor.offsetHeight;
				
				// Trigger slide-up animation
				setTimeout(() => {
					cursor.style.transition = 'all 300ms ease-out';
					cursor.style.opacity = '1';
					cursor.style.top = '70%';
					
					// Start blinking after slide animation
					setTimeout(() => {
						cursor.style.animation = 'blink 1s infinite';
					}, 300);
				}, 10);
			}
		}
	}

	function hideCursor(index) {
		const container = otpContainers[index];
		const cursor = container?.querySelector('.input-cursor');
		
		if (container && cursor) {
			// Reset cursor styles and animation
			cursor.style.animation = 'none';
			cursor.style.transition = 'none';
			cursor.style.opacity = '0';
			container.classList.remove('focused');
		}
	}

	function animateDigitDrop(index, digit) {
		const container = otpContainers[index];
		const digitDisplay = container?.querySelector('.digit-display');
		const cursor = container?.querySelector('.input-cursor');

		if (!digitDisplay) return;

		// Hide cursor when digit is entered but keep the focused border
		if (cursor) {
			cursor.style.animation = 'none';
			cursor.style.opacity = '0';
		}

		// Clear previous classes and set the digit
		digitDisplay.classList.remove('drop-in', 'filled');
		digitDisplay.textContent = digit;

		// Force reflow to ensure the removal of classes takes effect
		void digitDisplay.offsetHeight;

		// Add animation class
		digitDisplay.classList.add('drop-in');

		// After animation completes, mark as filled
		setTimeout(() => {
			if (digitDisplay) {
				digitDisplay.classList.remove('drop-in');
				digitDisplay.classList.add('filled');
			}
		}, 300);
	}

	function clearDigit(index) {
		const container = otpContainers[index];
		const digitDisplay = container?.querySelector('.digit-display');

		if (digitDisplay) {
			digitDisplay.textContent = '';
			digitDisplay.classList.remove('drop-in', 'filled');
		}

		// Remove error state but keep focused state for cursor visibility
		if (container) {
			container.classList.remove('error');
		}
	}

	function updateCurrentCode() {
		currentCode = Array.from(otpContainers).map(container => {
			const digitDisplay = container?.querySelector('.digit-display');
			return digitDisplay?.textContent || '';
		}).join('');
	}

	async function handleSubmit() {
		if (!isCodeComplete) {
			setState('error', 'Please enter all 6 digits');
			return;
		}

		// Show loading state
		isLoading = true;

		// Simulate API call
		await simulateVerification();
	}

	async function simulateVerification() {
		// Simulate network delay
		await new Promise(resolve => setTimeout(resolve, 1500));

		isLoading = false;

		if (currentCode === correctCode) {
			setState('success', 'Enter 6-digit code from your two factor authenticator APP');
		} else {
			setState('error', 'Enter 6-digit code from your two factor authenticator APP');
			triggerShakeAnimation();
			
		}
	}

	function setState(state, message = '') {
		currentState = state;
		
		if (message) {
			statusText = message;
		}

		// Update input container states
		otpContainers.forEach(container => {
			if (state === 'error') {
				container.classList.add('error');
			} else {
				container.classList.remove('error');
			}
		});
	}

	function triggerShakeAnimation() {
		if (otpInputGroup) {
			otpInputGroup.classList.add('shake');
			setTimeout(() => {
				otpInputGroup.classList.remove('shake');
			}, 400);
		}
	}
</script>

<svelte:head>
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="min-h-screen bg-[#F0F7FF] flex items-center justify-center p-2 font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif]">
	<div class="w-full max-w-[400px]">
		<div class="bg-white rounded-2xl p-8 shadow-[0px_10px_30px_rgba(0,0,0,0.07)] flex flex-col items-center gap-6 text-center">
			<!-- Status Icon -->
			<div class="relative flex items-center justify-center">
				<!-- Pulse wave animations -->
				{#if currentState === 'success'}
					<div class="absolute w-16 h-16 rounded-full bg-[rgba(52,199,89,0.3)] pulse-wave pulse-wave-1"></div>
					<div class="absolute w-16 h-16 rounded-full bg-[rgba(52,199,89,0.2)] pulse-wave pulse-wave-2"></div>
					<div class="absolute w-16 h-16 rounded-full bg-[rgba(52,199,89,0.1)] pulse-wave pulse-wave-3"></div>
				{:else if currentState === 'error'}
					<div class="absolute w-16 h-16 rounded-full bg-[rgba(255,59,48,0.3)] pulse-wave pulse-wave-1"></div>
					<div class="absolute w-16 h-16 rounded-full bg-[rgba(255,59,48,0.2)] pulse-wave pulse-wave-2"></div>
					<div class="absolute w-16 h-16 rounded-full bg-[rgba(255,59,48,0.1)] pulse-wave pulse-wave-3"></div>
				{/if}
				
				<!-- Main icon circle -->
				<div class="relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out z-10
					{currentState === 'success' ? 'bg-[rgba(52,199,89,0.1)] text-[#34C759]' : 
					 currentState === 'error' ? 'bg-[rgba(255,59,48,0.1)] text-[#FF3B30]' : 
					 'bg-[rgba(0,122,255,0.1)] text-[#007AFF]'}">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" 
						class="{currentState === 'error' ? 'lock-vibrate' : ''} {currentState === 'success' ? 'lock-unlock' : ''}">
						{#if currentState === 'success'}
							<!-- Unlocked state - open shackle -->
							<g>
								<!-- Lock body -->
								<path d="M12 14V17M18 15C18 18.3137 15.3137 21 12 21C8.68629 21 6 18.3137 6 15C6 11.6863 8.68629 9 12 9C15.3137 9 18 11.6863 18 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
								<!-- Open shackle - rotated to left -->
								<path class="shackle-unlock" d="M8 10V7C8 4.79086 9.79086 3 12 3C13.2091 3 14.2909 3.58579 15 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
								<!-- Lock dot -->
								<circle cx="12" cy="14" r="1" fill="currentColor"/>
							</g>
						{:else}
							<!-- Locked state -->
							<g>
								<!-- Lock body -->
								<path d="M12 14V17M18 15C18 18.3137 15.3137 21 12 21C8.68629 21 6 18.3137 6 15C6 11.6863 8.68629 9 12 9C15.3137 9 18 11.6863 18 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
								<!-- Closed shackle -->
								<path d="M8 10V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
								<!-- Lock dot -->
								<circle cx="12" cy="14" r="1" fill="currentColor"/>
							</g>
						{/if}
					</svg>
				</div>
			</div>

			<!-- Title -->
			<h1 class="text-2xl font-bold text-[#1F2937] m-0">Easy peasy</h1>

			<!-- Status Text -->
			<p class="text-sm font-normal m-0 transition-colors duration-300 ease-in-out
				{currentState === 'error' ? 'text-[#FF3B30]' : 
				 currentState === 'success' ? 'text-[#34C759]' : 
				 'text-[#6B7280]'}">{statusText}</p>

			<!-- OTP Input Group -->
			<div bind:this={otpInputGroup} class="flex gap-6 w-full justify-center otp-input-group">
				<div class="flex gap-3">
					{#each Array(3) as _, i}
						<div bind:this={otpContainers[i]} class="otp-input-container relative w-12 h-14 flex items-center justify-center border border-[#D1D5DB] rounded-lg bg-white transition-all duration-200 ease-in-out">
							<input
								bind:this={otpInputs[i]}
								type="text"
								class="otp-input absolute top-0 left-0 w-full h-full border-none bg-transparent text-center text-[28px] font-medium text-transparent outline-none z-[3] caret-transparent"
								maxlength="1"
								data-index={i}
								autocomplete="off"
								on:input={(e) => handleInput(e, i)}
								on:keydown={(e) => handleKeydown(e, i)}
								on:focus={(e) => { showCursor(i); e.target.select(); }}
								on:blur={() => hideCursor(i)}
								on:paste={(e) => handlePaste(e, i)}
							/>
							<div class="input-cursor absolute left-1/2 w-5 h-0.5 bg-[#007AFF] opacity-0 bottom-2 transition-all duration-300 ease-out" style="transform: translateX(-50%);"></div>
							<div class="digit-display absolute top-1/2 left-1/2 text-[28px] font-medium text-[#007AFF] opacity-0 z-[2]" style="transform: translate(-50%, -50%);"></div>
						</div>
					{/each}
				</div>
				<div class="flex gap-3">
					{#each Array(3) as _, i}
						{@const index = i + 3}
						<div bind:this={otpContainers[index]} class="otp-input-container relative w-12 h-14 flex items-center justify-center border border-[#D1D5DB] rounded-lg bg-white transition-all duration-200 ease-in-out">
							<input
								bind:this={otpInputs[index]}
								type="text"
								class="otp-input absolute top-0 left-0 w-full h-full border-none bg-transparent text-center text-[28px] font-medium text-transparent outline-none z-[3] caret-transparent"
								maxlength="1"
								data-index={index}
								autocomplete="off"
								on:input={(e) => handleInput(e, index)}
								on:keydown={(e) => handleKeydown(e, index)}
								on:focus={(e) => { showCursor(index); e.target.select(); }}
								on:blur={() => hideCursor(index)}
								on:paste={(e) => handlePaste(e, index)}
							/>
							<div class="input-cursor absolute left-1/2 w-5 h-0.5 bg-[#007AFF] opacity-0 bottom-2 transition-all duration-300 ease-out" style="transform: translateX(-50%);"></div>
							<div class="digit-display absolute top-1/2 left-1/2 text-[28px] font-medium text-[#007AFF] opacity-0 z-[2]" style="transform: translate(-50%, -50%);"></div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Action Button -->
			<button
				class="action-button relative py-4 rounded-xl border-none cursor-pointer font-semibold transition-all duration-200 ease-in-out overflow-hidden otp-button-width
					{isButtonDisabled ? 'opacity-60 cursor-not-allowed transform-none shadow-none bg-[#cdcdcd] text=[#cdcdcd]' :
					 currentState === 'error' ? 'bg-[#ff4359] text-white hover:shadow-[0px_4px_12px_rgba(255,59,48,0.3)] hover:-translate-y-0.5 active:translate-y-0' :
					 'bg-[#007AFF] text-white hover:shadow-[0px_4px_12px_rgba(0,122,255,0.3)] hover:-translate-y-0.5 active:translate-y-0'}
					{isLoading ? 'relative text-transparent' : ''}"
				disabled={isButtonDisabled}
				on:click={handleSubmit}
			>
				{#if currentState === 'success'}
					<div class="success-bg-animation absolute top-0 left-0 w-full h-full bg-[#34C759] z-0"></div>
				{/if}
				<span class="relative z-10">
					{#if isLoading}
						<div class="flex items-center justify-center h-6">
							<div class="w-5 h-5 border-2 border-transparent border-t-white rounded-full animate-spin"></div>
						</div>
					{:else}
						{buttonText}
					{/if}
				</span>
			</button>
		</div>
	</div>
</div>

<style>
	:global(.otp-input-container.focused) {
		border-color: #007AFF !important;
	}

	:global(.otp-input-container.error) {
		border-color: #FF3B30 !important;
	}

	:global(.otp-input-container.error .input-cursor) {
		background-color: #FF3B30 !important;
	}

	:global(.otp-input-container.error .digit-display) {
		color: #FF3B30 !important;
	}

	:global(.digit-display.drop-in) {
		animation: dropIn 300ms ease-out forwards !important;
	}

	:global(.digit-display.filled) {
		opacity: 1 !important;
	}

	:global(.otp-input-group.shake) {
		animation: shake 400ms ease-in-out !important;
	}

	@keyframes shake {
		0%, 100% { transform: translateX(0); }
		10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
		20%, 40%, 60%, 80% { transform: translateX(4px); }
	}

	@keyframes dropIn {
		0% {
			opacity: 0;
			transform: translate(-50%, -150%);
		}
		50% {
			opacity: 1;
			transform: translate(-50%, -40%);
		}
		100% {
			opacity: 1;
			transform: translate(-50%, -50%);
		}
	}

	@keyframes successPulse {
		0% { transform: scale(1); }
		50% { transform: scale(1.05); }
		100% { transform: scale(1); }
	}

	/* Pulse wave animations */
	:global(.pulse-wave) {
		animation: pulseWave 2s ease-out forwards;
	}

	:global(.pulse-wave-1) {
		animation-delay: 0s;
	}

	:global(.pulse-wave-2) {
		animation-delay: 0.4s;
	}

	:global(.pulse-wave-3) {
		animation-delay: 0.8s;
	}

	@keyframes pulseWave {
		0% {
			transform: scale(1);
			opacity: 0.8;
		}
		30% {
			transform: scale(1.4);
			opacity: 0.4;
		}
		70% {
			transform: scale(2.0);
			opacity: 0.1;
		}
		100% {
			transform: scale(2.5);
			opacity: 0;
		}
	}

	/* Blinking cursor animation */
	@keyframes blink {
		0%, 50% { opacity: 1 !important; }
		51%, 100% { opacity: 0 !important; }
	}

	/* Success button background slide animation */
	:global(.success-bg-animation) {
		animation: slideInFromRight 600ms ease-out forwards !important;
	}

	@keyframes slideInFromRight {
		0% {
			transform: translateX(100%);
		}
		100% {
			transform: translateX(0%);
		}
	}

	/* Responsive design */
	@media (max-width: 480px) {
		:global(.otp-input-container) {
			width: 42px !important;
			height: 52px !important;
		}
		
		:global(.otp-input) {
			font-size: 24px !important;
		}
		
		:global(.digit-display) {
			font-size: 24px !important;
		}
		
		:global(.input-cursor) {
			width: 16px !important;
			height: 2px !important;
		}

		:global(.otp-button-width) {
			width: calc(6 * 42px + 5 * 12px + 13px) !important;
		}
	}

	/* Button width calculation to match OTP input group */
	:global(.otp-button-width) {
		width: calc(6 * 48px + 5 * 12px + 13px);
	}

	/* Lock animations */
	:global(.lock-vibrate) {
		animation: lockVibrate 600ms ease-in-out !important;
	}

	:global(.lock-unlock) {
		animation: lockUnlock 800ms ease-in-out !important;
	}

	:global(.shackle-unlock) {
		animation: shackleSwingOpen 800ms ease-in-out !important;
	}

	@keyframes lockVibrate {
		0%, 100% { 
			transform: translateX(0) rotate(0deg); 
		}
		10%, 30%, 50%, 70%, 90% { 
			transform: translateX(-2px) rotate(-1deg); 
		}
		20%, 40%, 60%, 80% { 
			transform: translateX(2px) rotate(1deg); 
		}
	}

	@keyframes lockUnlock {
		0% { 
			transform: scale(1) rotate(0deg); 
		}
		30% { 
			transform: scale(1.05) rotate(-2deg); 
		}
		60% { 
			transform: scale(1.02) rotate(1deg); 
		}
		100% { 
			transform: scale(1) rotate(0deg); 
		}
	}

	@keyframes shackleSwingOpen {
		0% { 
			transform: rotate(0deg); 
			transform-origin: 8px 7px; 
			opacity: 1; 
		}
		30% { 
			transform: rotate(-15deg); 
			transform-origin: 8px 7px; 
			opacity: 0.9; 
		}
		60% { 
			transform: rotate(-35deg); 
			transform-origin: 8px 7px; 
			opacity: 0.8; 
		}
		100% { 
			transform: rotate(-45deg); 
			transform-origin: 8px 7px; 
			opacity: 0.7; 
		}
	}
</style>
