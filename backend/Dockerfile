FROM tensorflow/tensorflow:1.8.0-gpu
ENV PYTHONIOENCODING=utf-8
RUN apt-get update && apt-get -y install git \
    wget \
    vim \
    unzip \
    curl \
    build-essential \
    software-properties-common \ 
    && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*
RUN add-apt-repository ppa:fkrull/deadsnakes \
    && apt-get update \
    && apt-get -y install python3.6-dev \ 
    && cd /usr/local/bin \
    && ln -s /usr/bin/python3.6 python
RUN curl https://bootstrap.pypa.io/get-pip.py | python3.6
RUN pip3 install scispacy h5py sklearn tensorflow-gpu==1.8.0 pyhocon tensorflow_hub pyhocon nltk flask flask-cors 
RUN pip3 install https://s3-us-west-2.amazonaws.com/ai2-s2-scispacy/releases/v0.1.0/en_core_sci_sm-0.1.0.tar.gz

WORKDIR /backend
RUN git clone https://github.com/YerevaNN/Relation-extraction-pipeline.git
RUN git clone https://github.com/YerevaNN/SciERC.git Relation-extraction-pipeline/baselines/SciERC/scierc
COPY experiments.conf /backend/Relation-extraction-pipeline/baselines/SciERC/scierc/experiments.conf
COPY glove_50_300_2.txt.filtered /backend/Relation-extraction-pipeline/baselines/SciERC/scierc
COPY server.py /backend/ 
COPY process.sh /backend/ 

WORKDIR /backend/Relation-extraction-pipeline/baselines/SciERC/scierc
RUN wget https://github.com/YerevaNN/SciERC/releases/download/v0.1/scientific_n0.1c0.3r1.zip -P logs \
    && cd logs \
    && unzip scientific_n0.1c0.3r1.zip \
    && rm -f scientific_n0.1c0.3r1.zip
RUN ./scripts/fetch_required_data.sh
RUN ./scripts/build_custom_kernels.sh
RUN python -c "import nltk;nltk.download('punkt')"
