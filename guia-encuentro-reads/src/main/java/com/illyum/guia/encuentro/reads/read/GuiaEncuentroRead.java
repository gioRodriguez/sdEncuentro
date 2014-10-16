package com.illyum.guia.encuentro.reads.read;

import java.util.List;

import com.illyum.guia.encuentro.reads.exceptions.GuiaEncuenctroReadsNotFounException;
import com.illyum.guia.encuentro.reads.formatters.Formatter;
import com.illyum.guia.encuentro.reads.lines.GuiaEncuentroLine;
import com.illyum.guia.encuentro.reads.reader.GuiaEncuentroReader;

public class GuiaEncuentroRead implements Formatter{
	private final GuiaEncuentroReader _guiaEncuentroReader;
	private String _readPath;
	
	public GuiaEncuentroRead(
			GuiaEncuentroReader guiaEncuentroReader
	) {
		_guiaEncuentroReader = guiaEncuentroReader;
		_readPath = "";
	}

	@Override
	public String toHtml() {
		StringBuilder readBuilder = new StringBuilder();
		try {
			List<GuiaEncuentroLine> lines = _guiaEncuentroReader.readLines(_readPath);
			String header = getHeader(lines);
			String body = getBody(lines);
			readBuilder.append(header).append(body);
		} catch (GuiaEncuenctroReadsNotFounException e) {
			e.printStackTrace();
		}
		return readBuilder.toString();
	}

	private String getHeader(
			List<GuiaEncuentroLine> lines
	) {
		StringBuilder headerBuilder = new StringBuilder();
		
		headerBuilder.append("<div class='readHeader'>");
		headerBuilder.append("<ul>");
		
		for (GuiaEncuentroLine guiaEncuentroLine : lines) {	
			if(guiaEncuentroLine.isHeader()){
				headerBuilder.append(guiaEncuentroLine.toHtml());
			}				
		}
		
		headerBuilder.append("</ul>");
		headerBuilder.append("</div>");
		headerBuilder.append("<hr>");
		
		return headerBuilder.toString();
	}
	
	private String getBody(
			List<GuiaEncuentroLine> lines
	) {
		StringBuilder bodyBuilder = new StringBuilder();	
		bodyBuilder.append("<div class='readBoby'>");
		for (GuiaEncuentroLine guiaEncuentroLine : lines) {	
			if(!guiaEncuentroLine.isHeader()){
				bodyBuilder.append(guiaEncuentroLine.toHtml());
			}				
		}		
		bodyBuilder.append(GuiaEncuentroLine.FINAL_LINE.toHtml());
		bodyBuilder.append("</div>");
		return bodyBuilder.toString();
	}

	public void setReadPath(String readPath) {
		_readPath = readPath;
	}

}
