package com.illyum.guia.encuentro.reads.reader;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;

import com.google.common.base.Charsets;
import com.illyum.guia.encuentro.reads.exceptions.ReadsNotFounException;
import com.illyum.guia.encuentro.reads.lines.AbstractLine;

public class ReadsReaderFileImpl implements ReadsReader {

	@Override
	public List<AbstractLine> readLines(
			String filePath
	) throws ReadsNotFounException {		
		File guiaEncuentroFile = new File(filePath);
		if (!guiaEncuentroFile.exists()) {
			throw new ReadsNotFounException();
		}
		
		List<AbstractLine> guiEncuetroLine = new ArrayList<AbstractLine>();
		try {			
			List<String> guiaEncuentroFileLines = Files.readAllLines(
					guiaEncuentroFile.toPath(), 
					Charsets.UTF_8
			);
			
			int guiaEncuentroReadLine = 0;
			for (int currentLine = 0; currentLine < guiaEncuentroFileLines.size(); currentLine++) {
				AbstractLine guiaEncuentroLine = AbstractLine.createLine(
						guiaEncuentroFileLines.get(currentLine), 
						guiaEncuentroReadLine
				);
				
				if(guiaEncuentroLine.isNull()){
					continue;
				}
				
				guiEncuetroLine.add(
						guiaEncuentroLine
				);
				guiaEncuentroReadLine++;
			}
		} catch (IOException e) {
			throw new ReadsNotFounException(e.getMessage(), e);
		}
		
		return guiEncuetroLine;
	}
}
