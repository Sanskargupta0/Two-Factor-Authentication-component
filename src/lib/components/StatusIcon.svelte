<script lang="ts">
	export let state: 'default' | 'success' | 'error' = 'default';

	// Computed class to handle opacity modifiers properly
	$: containerClasses = [
		'flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300',
		state === 'success' ? 'bg-success-background text-success-main animate-successPulse' : '',
		state === 'error' ? 'bg-error-background text-error-main' : '',
		state === 'default' ? 'bg-primary-main/10 text-primary-main' : ''
	].filter(Boolean).join(' ');
</script>

<div
	class={containerClasses}
>
	<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
		{#if state === 'success'}
			<path
				d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
			/>
		{:else}
			<path
				d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"
			/>
		{/if}
	</svg>
</div>