package com.mita.exam.dto;

import com.mita.exam.entity.Question;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDto {
    private Long id;
    private Integer sortOrder;
    private String text;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;

    public static QuestionDto from(Question q) {
        return QuestionDto.builder()
                .id(q.getId())
                .sortOrder(q.getSortOrder())
                .text(q.getText())
                .optionA(q.getOptionA())
                .optionB(q.getOptionB())
                .optionC(q.getOptionC())
                .optionD(q.getOptionD())
                .build();
    }
}
