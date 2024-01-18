/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { INomenclatorResponse } from '@/interfaces/nomenclador.interface';
import { nomenclatorService } from '@/services/nomenclator.service';
import { transformArrayToObject } from '@/utils/convertNomenclators';
import React, { useEffect } from 'react';
import { NomenclatorEnum } from '../../../types/nomencladores';
import { SelectOption } from '@/types/select.type';


const useNomenclators = () => {
  const [nomenclators, setNomenclators] = React.useState<
    Record<NomenclatorEnum, SelectOption[]>
  >({
    outputype: [],
    channelstatus : [],
    channelprovider :[],
    genre :[],
    subgenre: [],
    country :[],
    language :[],
    parentalrating :[],
    programtype :[],
    videoid :[],
    contenttype :[],
    contentformat :[],
    series :[],
    externalmetadataId :[],
  });

  const fetchNomenclators = async () => {
    const { data } = await nomenclatorService.get({_limit: -1, populate: {}});
    // const { data: channelData } = await channelsService.get({
    //   populate: {},
    //   fields: {
    //     0: 'name',
    //   },
    //   _limit: -1
    // });
    const test = transformArrayToObject(data.data);
    setNomenclators(transformArrayToObject(data.data));
  };

  useEffect(() => {
    fetchNomenclators();
  }, []);

  return nomenclators;
};

export default useNomenclators;
