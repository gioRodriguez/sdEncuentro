package com.illyum.guia.encuentro.reads.lines;

public class FinalLine extends Line {
	
	private static final String FINAL_LINE_BODY = "<p><br><br></p>";

	@Override
	public String toHtml() {
		return FINAL_LINE_BODY;
	}

}
