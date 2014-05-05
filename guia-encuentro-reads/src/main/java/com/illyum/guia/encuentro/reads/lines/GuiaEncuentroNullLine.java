package com.illyum.guia.encuentro.reads.lines;

public class GuiaEncuentroNullLine extends GuiaEncuentroLine {
	@Override
	public boolean isNull() {
		return true;
	}

	@Override
	public String toHtml() {
		return "";
	}
}
