package com.illyum.guia.encuentro.reads.read;

import java.util.List;

import com.illyum.guia.encuentro.reads.exceptions.ReadsNotFounException;
import com.illyum.guia.encuentro.reads.formatters.HtmlFormatter;
import com.illyum.guia.encuentro.reads.lines.AbstractLine;
import com.illyum.guia.encuentro.reads.reader.ReadsReader;

public class ReadsRepository implements HtmlFormatter{
	private final ReadsReader _guiaEncuentroReader;
	private String _readPath;
	
	public ReadsRepository(
			ReadsReader guiaEncuentroReader
	) {
		_guiaEncuentroReader = guiaEncuentroReader;
		_readPath = "";
	}

	@Override
	public String toHtml() {
		StringBuilder readBuilder = new StringBuilder();
		try {
			List<AbstractLine> lines = _guiaEncuentroReader.readLines(_readPath);
			String header = getHeader(lines);
			String body = getBody(lines);
			readBuilder.append(header).append(body);
		} catch (ReadsNotFounException e) {
			e.printStackTrace();
		}
		return readBuilder.toString();
	}

	private String getHeader(
			List<AbstractLine> lines
	) {
		StringBuilder headerBuilder = new StringBuilder();
		
		headerBuilder.append("<div class='readHeader'>");
		headerBuilder.append("<ul>");
		
		for (AbstractLine guiaEncuentroLine : lines) {	
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
			List<AbstractLine> lines
	) {
		StringBuilder bodyBuilder = new StringBuilder();	
		bodyBuilder.append("<div class='readBoby'>");
		for (AbstractLine guiaEncuentroLine : lines) {	
			if(!guiaEncuentroLine.isHeader()){
				bodyBuilder.append(guiaEncuentroLine.toHtml());
			}				
		}		
		bodyBuilder.append(AbstractLine.FINAL_LINE.toHtml());
		bodyBuilder.append("</div>");
		return bodyBuilder.toString();
	}

	public void setReadPath(String readPath) {
		_readPath = readPath;
	}

}
