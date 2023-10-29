<div class="split">
	<div class="a"><slot name="a" /></div>
	<div class="b"><slot name="b" /></div>
</div>
<div class="clear" />

<style>
	.a {
		float: left;
		margin-right: var(--pad);
	}

	.b {
		float: right;
	}

	.split::after {
		display: block;
		content: "";
		clear: both;
	}
</style>
