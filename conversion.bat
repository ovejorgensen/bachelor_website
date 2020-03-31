@ECHO OFF

del /q "conversion\output\*.*"

set PATH=%PATH%;"%~dp0conversion\LAStools\bin";
set PATH=%PATH%;"%~dp0conversion\PotreeConverter";

IF EXIST conversion\files\output.laz GOTO LAZ
IF EXIST conversion\files\output.las GOTO LAS
IF EXIST conversion\files\output.txt GOTO TXT

:TXT
txt2las -i conversion\files\output.txt ^
	-o conversion\files/output.las ^
	-parse xyz 

del conversion\files\output.txt

potreeconverter conversion\files\output.las ^
		-o conversion\output\

del conversion\files\output.las
GOTO END

:LAZ
potreeconverter conversion\files\output.laz ^
		-o conversion\output\

del conversion\files\output.laz
GOTO END

:LAS
potreeconverter conversion\files\output.las ^
		-o conversion\output\
del conversion\files\output.las
GOTO END

:END
