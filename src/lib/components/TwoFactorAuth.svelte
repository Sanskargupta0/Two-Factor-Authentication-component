<script lang="ts">
	import { onMount } from 'svelte';
	import StatusIcon from './StatusIcon.svelte';
	import OtpInput from './OtpInput.svelte';

	// STATE
	let inputs = Array(6).fill('');
	let activeInputIndex = 0;
	let currentState: 'default' | 'success' | 'error' = 'default';
	let statusText = 'Enter 6-digit code from your two factor authenticator APP';
	let isLoading = false;
	let buttonText = '';
	let isButtonDisabled = true;

	// BINDINGS
	let otpGroupElement: HTMLDivElement;
	let inputElements: HTMLInputElement[] = [];

	const CORRECT_CODE = '123456'; // Demo code

	// REACTIVE LOGIC
	$: currentCode = inputs.join('');

	// Reactive block to update the button state whenever the code changes
	$: {
		const digitsEntered = currentCode.length;
		const digitsLeft = 6 - digitsEntered;

		if (digitsLeft > 0) {
			isButtonDisabled = true;
			if (digitsLeft === 1) {
				buttonText = '1 digit left';
			} else {
				buttonText = `${digitsLeft} digits left`;
			}
		} else {
			isButtonDisabled = false;
			buttonText = 'Verify the code';
		}

        // Reset error state on new input
        if (currentState === 'error' && digitsEntered > 0) {
            currentState = 'default';
            statusText = 'Enter 6-digit code from your two factor authenticator APP';
        }
	}

	// Computed button class to handle hover opacity
	$: buttonClasses = [
		'relative w-full rounded-button p-4 text-base font-semibold text-neutral-white transition-all duration-200',
		currentState !== 'error' ? 'bg-primary-main hover:bg-primary-main/90 hover:shadow-button-hover' : '',
		currentState === 'error' ? 'bg-error-main hover:shadow-button-error-hover' : '',
		isButtonDisabled || isLoading ? 'cursor-not-allowed' : '',
		isButtonDisabled && !isLoading ? 'bg-button-disabled-bg text-button-disabled-text' : '',
		isLoading ? 'text-transparent' : ''
	].filter(Boolean).join(' ');

	onMount(() => {
		// Focus the first input on load
		inputElements[0]?.focus();
	});

	// EVENT HANDLERS
	function handleInput(e: CustomEvent) {
		const { index } = e.detail;
		const value = e.detail.event.target.value;

		if (!/^\d$/.test(value)) return;

		inputs[index] = value;
		inputs = [...inputs]; // Trigger reactivity

		if (index < 5) {
			activeInputIndex = index + 1;
			inputElements[activeInputIndex]?.focus();
		}
	}

	function handleKeydown(e: CustomEvent) {
		const { index, event } = e.detail;

		if (event.key === 'Backspace') {
			event.preventDefault();
			if (inputs[index]) {
				inputs[index] = '';
			} else if (index > 0) {
				inputs[index - 1] = '';
				activeInputIndex = index - 1;
				inputElements[activeInputIndex]?.focus();
			}
			inputs = [...inputs];
		} else if (event.key === 'ArrowLeft' && index > 0) {
			activeInputIndex = index - 1;
			inputElements[activeInputIndex]?.focus();
		} else if (event.key === 'ArrowRight' && index < 5) {
			activeInputIndex = index + 1;
			inputElements[activeInputIndex]?.focus();
		}
	}

	function handlePaste(e: CustomEvent) {
		const { index, event } = e.detail;
		const pastedData = event.clipboardData.getData('text').replace(/\D/g, '');

		if (!pastedData) return;

		const end = Math.min(index + pastedData.length, 6);
		for (let i = 0; i < end - index; i++) {
			inputs[index + i] = pastedData[i];
		}
		inputs = [...inputs];
		activeInputIndex = Math.min(end, 5);
		inputElements[activeInputIndex]?.focus();
	}

	async function handleSubmit() {
		if (currentCode.length !== 6) return;
		isLoading = true;

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1500));

		if (currentCode === CORRECT_CODE) {
			currentState = 'success';
			buttonText = "Let's go!";
		} else {
			currentState = 'error';
			buttonText = 'Wrong code!';
			triggerShakeAnimation();
			// Clear inputs after showing error
			setTimeout(() => {
				inputs = Array(6).fill('');
				activeInputIndex = 0;
				inputElements[0]?.focus();
			}, 400);
		}
		isLoading = false;
	}

	function triggerShakeAnimation() {
		otpGroupElement.classList.add('animate-shake');
		otpGroupElement.addEventListener('animationend', () => {
			otpGroupElement.classList.remove('animate-shake');
		}, { once: true });
	}
</script>

<div class="flex flex-col items-center gap-6 rounded-card bg-neutral-white p-8 text-center shadow-card">
	<StatusIcon state={currentState} />

	<h1 class="text-2xl font-bold text-neutral-text-dark">Easy peasy</h1>
	<p class="text-sm font-normal text-neutral-text-light">{statusText}</p>

	<div bind:this={otpGroupElement} class="flex w-full justify-center gap-2 md:gap-4">
		{#each inputs as value, i}
			<OtpInput
				{value}
				index={i}
				isFocused={i === activeInputIndex}
				hasError={currentState === 'error'}
				on:input={handleInput}
				on:keydown={handleKeydown}
				on:paste={handlePaste}
				on:focus={(e) => (activeInputIndex = e.detail.index)}
				bind:inputElement={inputElements[i]}
			/>
		{/each}
	</div>

	<button
		on:click={handleSubmit}
		disabled={isButtonDisabled || isLoading}
		class={buttonClasses}
	>
		{buttonText}
		{#if isLoading}
			<div
				class="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-t-neutral-white border-r-transparent border-b-transparent border-l-transparent"
			></div>
		{/if}
	</button>
</div>