<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	export let value: string;
	export let isFocused: boolean = false;
	export let hasError: boolean = false;
	export let index: number;

	let inputElement: HTMLInputElement;
	let digitDisplay: HTMLDivElement;

	const dispatch = createEventDispatcher();

	onMount(() => {
		if (isFocused) {
			inputElement.focus();
		}
	});

	// Animate digit drop
	$: if (value) {
		digitDisplay.classList.remove('animate-dropIn');
		// void digitDisplay.offsetHeight; // Force reflow
		setTimeout(() => digitDisplay.classList.add('animate-dropIn'), 0);
	}

	// Computed classes for the underline div to handle position classes with forward slashes
	$: underlineClasses = [
		'absolute left-1/2 h-0.5 w-5 -translate-x-1/2 bg-primary-main opacity-0 transition-all duration-300',
		isFocused && !value && !hasError ? 'opacity-100 bottom-2 top-1/2 -translate-y-1/2' : ''
	].filter(Boolean).join(' ');
</script>

<div
	class="relative flex h-14 w-12 items-center justify-center rounded-input border bg-neutral-white transition-colors duration-200"
	class:border-primary-main={isFocused && !hasError}
	class:border-error-main={hasError}
	class:border-neutral-border={!isFocused && !hasError}
>
	<input
		bind:this={inputElement}
		type="text"
		maxlength="1"
		autocomplete="off"
		class="absolute inset-0 z-10 h-full w-full border-none bg-transparent text-center text-transparent caret-transparent outline-none"
		on:input|preventDefault={(e) => dispatch('input', { event: e, index })}
		on:keydown={(e) => dispatch('keydown', { event: e, index })}
		on:paste|preventDefault={(e) => dispatch('paste', { event: e, index })}
		on:focus={() => dispatch('focus', { index })}
	/>

	<div
		class={underlineClasses}
	></div>

	<div
		bind:this={digitDisplay}
		class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-medium"
		class:text-error-main={hasError}
		class:text-primary-main={!hasError}
		class:opacity-100={value}
		class:opacity-0={!value}
	>
		{value}
	</div>
</div>