export const styles = `
.confront, .confront-input {
	font: 13px/13px 'Inconsolata-g for Powerline', Inconsolata, Consolas, 'Courier New', Courier, 'Lucida Console', Monaco, monospace !important
}

.confront {
	background: rgba(24, 53, 74, .8);
	height: 230px;
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 5px;
	border-top: solid 1px rgba(255, 255, 255, .3);
	overflow: auto
}

.confront-input {
	height: 20px;
	width: 100%;
	display: block;
	color: #83e216;
	background: 0 0;
	border: none;
	margin: 0;
	padding: 0;
	outline: 0
}

.confront-input::-ms-clear {
	display: none
}

.confront-cmd {
	color: #e5e5e5
}

.confront-error {
	color: #ff2614
}

.confront-default {
	color: #18d5ff
}

.confront-table {
	color: #83e216
}

.confront-table td {
	padding: 2px 5px
}

.confront-table td:first-child {
	padding-left: 0
}

.confront-label {
	color: #e5e5e5
}

.confront-value {
	color: #c3c3c3
}

.confront-spinner {
	width: 18px;
	height: 18px;
	border: 2px solid rgba(131, 226, 22, .35);
	border-top: 2px solid #83e216;
	border-radius: 50%;
	animation: spin 1s linear infinite
}

.confront-output > pre {
	margin-top: 3px;
	margin-bottom: 3px
}

@keyframes spin {
	0% {
		transform: rotate(0)
	}
	100% {
		transform: rotate(360deg)
	}
}

`
