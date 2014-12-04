package com.illyum.guia.encuentro.reads.lines;

public class NullLine extends AbstractLine {
	@Override
	public boolean isNull() {
		return true;
	}

	@Override
	public String toHtml() {
		return "";
	}
}
