package com.illyum.guia.encuentro.reads.lines;

import com.google.common.base.Strings;
import com.illyum.guia.encuentro.reads.formatters.Formatter;

public abstract class GuiaEncuentroLine implements NullObject, Formatter {

	private static final int LINES_TO_USE_AS_HEADER = 4;

	private static GuiaEncuentroLine NULL_LINE = new GuiaEncuentroNullLine();

	private String _lineBody;
	private int _lineIndex;

	protected GuiaEncuentroLine(){	
		this("", -1);
	}
	
	protected GuiaEncuentroLine(
			String lineBody,
			int lineIndex
	) {
		_lineBody = lineBody;
		_lineIndex = lineIndex;
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

	public static GuiaEncuentroLine createLine(
			String lineBody,
			int lineIndex
	) {
		if (Strings.isNullOrEmpty(lineBody) || "".equals(lineBody.trim())) {
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
		return 0 <= lineIndex && lineIndex <= LINES_TO_USE_AS_HEADER;
	}

	public static GuiaEncuentroLine nullLine() {
		return NULL_LINE;
	}

	public static GuiaEncuentroLine headerLine(
			String lineBody,
			int lineIndex
	) {
		return new GuiaEncuentroHeaderLine(lineBody, lineIndex);
	}

	public static GuiaEncuentroLine bodyLine(
			String lineBody,
			int lineIndex
	) {
		return new GuiaEncuentroBodyLine(lineBody, lineIndex);
	}
	
	@Override
	public boolean equals(
			Object obj
	) {
		if(obj == null ||
				!GuiaEncuentroLine.class.isAssignableFrom(getClass())){
			return false;
		}
		
		GuiaEncuentroLine other = (GuiaEncuentroLine) obj;
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
