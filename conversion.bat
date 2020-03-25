@ECHO OFF

del /q "conversion\output\*.*"

set PATH=%PATH%;"%~dp0conversion\LAStools\bin";

txt2las -i conversion\txtfiles\*.txt ^
	-o conversion\lasfiles/output.las ^
	-parse xyz 

del conversion\txtfiles\*.txt

set PATH=%PATH%;"%~dp0conversion\PotreeConverter";

potreeconverter conversion\lasfiles\output.las ^
		-o conversion\output\

del conversion\lasfiles\output.las

