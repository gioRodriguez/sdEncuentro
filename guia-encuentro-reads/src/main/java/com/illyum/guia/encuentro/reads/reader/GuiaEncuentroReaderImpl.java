package com.illyum.guia.encuentro.reads.reader;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;

import com.google.common.base.Charsets;
import com.illyum.guia.encuentro.reads.exceptions.GuiaEncuenctroReadsNotFounException;
import com.illyum.guia.encuentro.reads.lines.GuiaEncuentroLine;

public class GuiaEncuentroReaderImpl implements GuiaEncuentroReader {

	@Override
	public List<GuiaEncuentroLine> readLines(
			String filePath
	) throws GuiaEncuenctroReadsNotFounException {		
		File guiaEncuentroFile = new File(filePath);
		if (!guiaEncuentroFile.exists()) {
			throw new GuiaEncuenctroReadsNotFounException();
		}
		
		List<GuiaEncuentroLine> guiEncuetroLine = new ArrayList<GuiaEncuentroLine>();
		try {			
			List<String> guiaEncuentroFileLines = Files.readAllLines(
					guiaEncuentroFile.toPath(), 
					Charsets.UTF_8
			);
			
			int guiaEncuentroReadLine = 0;
			for (int currentLine = 0; currentLine < guiaEncuentroFileLines.size(); currentLine++) {
				GuiaEncuentroLine guiaEncuentroLine = GuiaEncuentroLine.createLine(
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
			throw new GuiaEncuenctroReadsNotFounException(e.getMessage(), e);
		}
		
		return guiEncuetroLine;
	}
}
