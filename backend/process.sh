#!/bin/bash

cd /backend/Relation-extraction-pipeline/baselines/SciERC
rm -f *.json *.hdf5 *.whitespace
cd /backend/Relation-extraction-pipeline/baselines/SciERC/scierc/
echo "\n\n**********  prepare_input.py  ***************\n\n"
python ../prepare_input.py --input ../1.0alpha4.test.txt --text_mode --output ../1.0alpha4.test.scierc.json --output_whitespace ../1.0alpha4.test.scierc.whitespace
echo "\n\n**********  generate_elmo.py  ***************\n\n"
python generate_elmo.py --input ../1.0alpha4.test.scierc.json --output ../1.0alpha4.scierc.elmo.hdf5
echo "\n\n**********  write_single.py  ***************\n\n"
python write_single.py scientific_n0.1c0.3r1
echo "\n\n**********  recover.py  ***************\n\n"
python ../recover.py --prediction ../1.0alpha4.test.scierc.output.n0.1c0.3r1.json --scierc_input ../1.0alpha4.test.scierc.json --whitespaces ../1.0alpha4.test.scierc.whitespace --output ../1.0alpha4.test.prediction.scierc_n0.1c0.3r1.json

echo "Processed Successfully"

