package com.illyum.guia.encuentro.reads.lines;

import com.google.common.base.Strings;
import com.illyum.guia.encuentro.reads.formatters.HtmlFormatter;

public abstract class Line implements NullObject, HtmlFormatter {

	private static final int MIN_HEADER_LENGHT = 3;

	private static final int LINES_TO_USE_AS_HEADER = 3;

	private static final Line NULL_LINE = new NullLine();
	
	public static final Line FINAL_LINE = new FinalLine();

	private String _lineBody;
	private int _lineIndex;

	protected Line(){	
		this("", -1);
	}
	
	protected Line(
			String lineBody,
			int lineIndex
	) {
		_lineBody = lineBody;
		_lineIndex = lineIndex;
	}
	
	public int getLineIndex(){
		return _lineIndex;
	}
	
	public String getLineBody(){
		return _lineBody;
	}
	
	@Override
	public boolean isNull(){
		return false;
	}
	
	public boolean isHeader(){
		return false;
	}

	public static Line createLine(
			String lineBody,
			int lineIndex
	) {
		if (Strings.isNullOrEmpty(lineBody) || 
				"".equals(lineBody.trim()) ||
				lineBody.length() < MIN_HEADER_LENGHT) {
			return nullLine();
		}

		if (isHeaderLine(lineIndex)) {
			return headerLine(
					lineBody,
					lineIndex
			);
		}

		return bodyLine(
				lineBody,
				lineIndex
		);
	}

	public static boolean isHeaderLine(
			int lineIndex) {
		return 0 <= lineIndex && lineIndex < LINES_TO_USE_AS_HEADER;
	}

	public static Line nullLine() {
		return NULL_LINE;
	}

	public static Line headerLine(
			String lineBody,
			int lineIndex
	) {
		return new HeaderLine(lineBody, lineIndex);
	}

	public static Line bodyLine(
			String lineBody,
			int lineIndex
	) {
		return new BodyLine(lineBody, lineIndex);
	}
	
	@Override
	public boolean equals(
			Object obj
	) {
		if(obj == null ||
				!Line.class.isAssignableFrom(getClass())){
			return false;
		}
		
		Line other = (Line) obj;
		if(isNull() && other.isNull()){
			return true;
		}
		
		if(_lineIndex == other._lineIndex &&
				_lineBody.equals(other._lineBody)){
			return true;
		}
		
		return false;
	}

}
