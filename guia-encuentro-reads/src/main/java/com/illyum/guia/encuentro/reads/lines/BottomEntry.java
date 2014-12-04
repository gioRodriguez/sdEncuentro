package com.illyum.guia.encuentro.reads.lines;

public class BottomEntry extends AbstractLine implements Entry {
	
	private static final String FINAL_LINE_BODY = "<p><br><br></p>";

	@Override
	public String toHtml() {
		return FINAL_LINE_BODY;
	}

	public static BottomEntry create() {
		return new BottomEntry();
	}

	@Override
	public void addEntry(Entry entry) {
		// TODO Auto-generated method stub
		
	}

}
