package com.mita.schedule.service;

import com.mita.schedule.dto.ScheduleDto;
import com.mita.schedule.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;

    @Transactional(readOnly = true)
    public List<ScheduleDto> getAll() {
        return scheduleRepository.findAllByOrderByDayOfWeekAscPeriodAsc()
                .stream().map(ScheduleDto::from).toList();
    }
}
